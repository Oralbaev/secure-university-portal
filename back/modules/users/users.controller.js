const jwt = require('jsonwebtoken')
const usersService = require('./users.service')
const config = require('../../config')
const { hashPassword, verifyPassword } = require('../../helpers/utils/password')

const UsersControllers = {
  login: async (req, res) => {
    const username = req.body.username.trim().toLowerCase()
    const user = await usersService.findOne({
      filter: { username },
      select: ['+passwordHash']
    })

    if (
      !user ||
      user.status !== 'active' ||
      !(await verifyPassword(req.body.password, user.passwordHash))
    ) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid username or password'
      })
    }

    const token = jwt.sign(
      { id: user._id, tokenVersion: user.tokenVersion },
      config.SECRET_KEY,
      { expiresIn: config.JWT_EXPIRES_IN }
    )

    return res.json({
      status: 'success',
      token,
      user: {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        mustChangePassword: user.mustChangePassword
      }
    })
  },
  logout: async (req, res) => {
    await usersService.updateOne(
      { _id: req.user._id },
      { $inc: { tokenVersion: 1 } }
    )
    return res.json({ status: 'success' })
  },
  currentUser: async (req, res) => {
    const { _id, username, firstName, lastName, role, mustChangePassword } =
      req.user
    return res.json({
      status: 'success',
      user: { id: _id, username, firstName, lastName, role, mustChangePassword }
    })
  },
  changePassword: async (req, res) => {
    const user = await usersService.findById(req.user._id, {
      select: ['+passwordHash']
    })
    if (!(await verifyPassword(req.body.currentPassword, user?.passwordHash))) {
      return res.status(400).json({
        status: 'error',
        message: 'Current password is incorrect'
      })
    }

    const tokenVersion = req.user.tokenVersion + 1
    await usersService.updateOne(
      { _id: req.user._id },
      {
        $set: {
          passwordHash: await hashPassword(req.body.newPassword),
          mustChangePassword: false,
          tokenVersion
        }
      }
    )
    const token = jwt.sign(
      { id: req.user._id, tokenVersion },
      config.SECRET_KEY,
      { expiresIn: config.JWT_EXPIRES_IN }
    )
    return res.json({ status: 'success', token })
  }
}

const toPublicUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  role: user.role,
  status: user.status,
  mustChangePassword: user.mustChangePassword
})

UsersControllers.toPublicUser = toPublicUser
module.exports = UsersControllers
