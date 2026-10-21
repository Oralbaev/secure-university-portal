const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const usersService = require('./users.service')
const config = require('../../config')
const HttpError = require('../../helpers/errors/HttpError')
const { sendSms } = require('../../helpers/utils/sms')

const SMS_CODE_TTL_MS = 5 * 60 * 1000
const SMS_RESEND_COOLDOWN_MS = 60 * 1000
const SMS_MAX_ATTEMPTS = 5

const generateSmsCode = () =>
  config.NODE_ENV === 'production'
    ? String(crypto.randomInt(1000, 10000))
    : '1234'

/**
 * Stores a fresh code on the user and sends it. Enforces a resend cooldown so
 * the endpoint can't be used to spam SMS or reset the attempt counter.
 */
async function issueSmsCode(user) {
  if (
    user.smsSentAt &&
    Date.now() - user.smsSentAt.getTime() < SMS_RESEND_COOLDOWN_MS
  ) {
    throw new HttpError(
      429,
      'Please wait before requesting another code',
      'SMS_COOLDOWN'
    )
  }

  const smsCode = generateSmsCode()
  const now = new Date()

  await usersService.updateOne(
    { _id: user._id },
    {
      $set: {
        smsCode,
        smsCodeExpiresAt: new Date(now.getTime() + SMS_CODE_TTL_MS),
        smsAttempts: 0,
        smsSentAt: now
      }
    }
  )

  await sendSms({
    phoneNumber: user.phoneNumber,
    text: `Your verification code: ${smsCode}`
  })
}

const UsersControllers = {
  login: async (req, res) => {
    const { phoneNumber } = req.body

    let user = await usersService.findOne({ filter: { phoneNumber } })
    const isNewUser = !user

    if (isNewUser) {
      user = await usersService.create({ phoneNumber })
    }

    await issueSmsCode(user)

    return res
      .status(isNewUser ? 201 : 200)
      .json({ status: 'success', id: user._id })
  },
  checkSms: async (req, res) => {
    const { smsCode, id } = req.body

    const user = await usersService.findOne({ filter: { _id: id } })

    if (!user || !user.smsCode || user.smsCodeExpiresAt < new Date()) {
      return res.status(400).send({
        status: 'error',
        message: 'Invalid sms code'
      })
    }

    if (user.smsAttempts >= SMS_MAX_ATTEMPTS) {
      return res.status(429).send({
        status: 'error',
        message: 'Too many attempts, request a new code'
      })
    }

    if (user.smsCode !== smsCode) {
      await usersService.updateOne(
        { _id: user._id },
        { $inc: { smsAttempts: 1 } }
      )
      return res.status(400).send({
        status: 'error',
        message: 'Invalid sms code'
      })
    }

    const token = jwt.sign(
      { id: user._id, tokenVersion: user.tokenVersion },
      config.SECRET_KEY,
      { expiresIn: config.JWT_EXPIRES_IN }
    )

    await usersService.updateOne(
      { _id: user._id },
      {
        $set: { loggedIn: true },
        $unset: { smsCode: '', smsCodeExpiresAt: '', smsAttempts: '' }
      }
    )
    return res.json({ status: 'success', token, id: user._id })
  },

  resendSms: async (req, res) => {
    const { id } = req.body

    const user = await usersService.findOne({ filter: { _id: id } })

    if (!user) {
      return res
        .status(400)
        .json({ status: 'error', message: 'User not found' })
    }

    await issueSmsCode(user)

    return res.json({ status: 'success', message: 'SMS code resent' })
  },
  logout: async (req, res) => {
    const { user } = req

    // Bumping tokenVersion invalidates every token issued before this logout
    await usersService.updateOne(
      { _id: user._id },
      {
        $set: { loggedIn: false },
        $inc: { tokenVersion: 1 }
      }
    )

    return res.json({ status: 'success' })
  }
}

module.exports = UsersControllers
