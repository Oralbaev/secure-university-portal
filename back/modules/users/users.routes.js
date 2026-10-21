const express = require('express')
const UsersControllers = require('./users.controller')
const requireUser = require('../../helpers/auth/requireUser')
const { validate } = require('../../helpers/validate')
const {
  loginSchema,
  checkSmsSchema,
  resendSmsSchema
} = require('./users.validator')
const { wrapAsync } = require('../../helpers/middlewares')
const router = express.Router()

router.post('/login', validate(loginSchema), wrapAsync(UsersControllers.login))
router.post(
  '/check-sms',
  validate(checkSmsSchema),
  wrapAsync(UsersControllers.checkSms)
)
router.post(
  '/resend-sms',
  validate(resendSmsSchema),
  wrapAsync(UsersControllers.resendSms)
)
router.post('/logout', requireUser, wrapAsync(UsersControllers.logout))

module.exports = { name: 'users', router }
