const usersService = require('./users.service')
const HttpError = require('../../helpers/errors/HttpError')
const { toPublicUser } = require('./users.controller')
const ROLES = require('./helpers/roles')

const UsersAdminControllers = {
  /**
   * Lists users. Supports optional filtering by role and status.
   */
  list: async (req, res) => {
    const { role, status, page, limit } = req.query

    const filter = {}
    if (role) filter.role = role
    if (status) filter.status = status

    const result = await usersService.paginate({
      filter,
      pagination: { page, limit }
    })

    return res.json({
      status: 'success',
      users: result.docs.map(toPublicUser),
      pagination: {
        total: result.totalDocs,
        page: result.page,
        pages: result.totalPages
      }
    })
  },

  /**
   * Creates a user. This is the only way an account comes into existence:
   * there is no self-registration.
   *
   * If no password is supplied, a temporary one is generated and returned once.
   */
  create: async (req, res) => {
    const { password, role, email, phoneNumber, firstName, lastName } = req.body
    const username = req.body.username.trim().toLowerCase()

    const payload = {
      username,
      role: role || ROLES.STUDENT,
      email,
      phoneNumber,
      firstName,
      lastName
    }

    const existing = await usersService.findOne({ filter: { username } })
    if (existing) {
      throw new HttpError(409, 'Username is already taken', 'USERNAME_TAKEN')
    }

    if (password) {
      const user = await usersService.createWithPassword({
        ...payload,
        password
      })
      await usersService.updateOne(
        { _id: user._id },
        { $set: { mustChangePassword: false } }
      )
      user.mustChangePassword = false

      return res.status(201).json({
        status: 'success',
        user: toPublicUser(user)
      })
    }

    const { user, temporaryPassword } =
      await usersService.createWithTemporaryPassword(payload)

    return res.status(201).json({
      status: 'success',
      user: toPublicUser(user),
      // Shown only once, so the admin can hand it over.
      temporaryPassword
    })
  },
  /**
   * Updates a user's profile, role or status.
   */
  update: async (req, res) => {
    const { id } = req.params
    const { email, phoneNumber, firstName, lastName, role, status } = req.body

    const update = {}
    if (email !== undefined) update.email = email
    if (phoneNumber !== undefined) update.phoneNumber = phoneNumber
    if (firstName !== undefined) update.firstName = firstName
    if (lastName !== undefined) update.lastName = lastName
    if (role !== undefined) update.role = role
    if (status !== undefined) update.status = status

    const user = await usersService.findByIdAndUpdateOrFail(id, {
      data: { $set: update }
    })

    return res.json({ status: 'success', user: toPublicUser(user) })
  },

  /**
   * Issues a new temporary password and invalidates the user's tokens.
   */
  resetPassword: async (req, res) => {
    const { id } = req.params
    const { password } = req.body

    const user = await usersService.findByIdOrFail(id)
    const temporaryPassword = await usersService.resetPassword(user, password)

    return res.json({
      status: 'success',
      message: 'Password reset',
      // Shown only once, so the admin can hand it over.
      temporaryPassword
    })
  },

  /**
   * Soft deletes a user.
   */
  remove: async (req, res) => {
    const { id } = req.params
    const { user } = req

    if (user._id.toString() === id) {
      throw new HttpError(
        400,
        'You cannot delete your own account',
        'CANNOT_DELETE_SELF'
      )
    }

    await usersService.deleteOneOrFail(id)

    return res.json({ status: 'success' })
  }
}

module.exports = UsersAdminControllers
