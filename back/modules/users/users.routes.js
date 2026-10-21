const express = require('express')
const UsersControllers = require('./users.controller')
const UsersAdminControllers = require('./users.admin.controller')
const requireUser = require('../../helpers/auth/requireUser')
const requireAdmin = require('../../helpers/auth/requireAdmin')
const { validate } = require('../../helpers/validate')
const {
  loginSchema,
  adminCreateSchema,
  adminUpdateSchema,
  adminIdSchema,
  resetPasswordSchema,
  changePasswordSchema
} = require('./users.validator')
const { wrapAsync } = require('../../helpers/middlewares')
const router = express.Router()

router.post('/login', validate(loginSchema), wrapAsync(UsersControllers.login))
router.get('/me', requireUser, wrapAsync(UsersControllers.currentUser))
router.post('/logout', requireUser, wrapAsync(UsersControllers.logout))
router.post(
  '/change-password',
  requireUser,
  validate(changePasswordSchema),
  wrapAsync(UsersControllers.changePassword)
)
router.get('/admin/users', requireAdmin, wrapAsync(UsersAdminControllers.list))
router.post(
  '/admin/users',
  requireAdmin,
  validate(adminCreateSchema),
  wrapAsync(UsersAdminControllers.create)
)
router.put(
  '/admin/users/:id',
  requireAdmin,
  validate(adminUpdateSchema),
  wrapAsync(UsersAdminControllers.update)
)
router.post(
  '/admin/users/:id/reset-password',
  requireAdmin,
  validate(resetPasswordSchema),
  wrapAsync(UsersAdminControllers.resetPassword)
)
router.delete(
  '/admin/users/:id',
  requireAdmin,
  validate(adminIdSchema),
  wrapAsync(UsersAdminControllers.remove)
)

module.exports = { name: 'users', router }
