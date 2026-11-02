const express = require('express')
const GradesControllers = require('./grades.controller')
const requireUser = require('../../helpers/auth/requireUser')
const requireAdmin = require('../../helpers/auth/requireAdmin')
const requireRole = require('../../helpers/auth/requireRole')
const ROLES = require('../users/helpers/roles')
const { validate } = require('../../helpers/validate')
const {
  gradeIdSchema,
  createSchema,
  updateSchema,
  adminListSchema
} = require('./grades.validator')
const { wrapAsync } = require('../../helpers/middlewares')
const router = express.Router()

router.get('/me', requireUser, wrapAsync(GradesControllers.getMine))
router.get(
  '/teacher',
  requireRole(ROLES.TEACHER),
  wrapAsync(GradesControllers.getTeacher)
)
router.get(
  '/admin',
  requireAdmin,
  validate(adminListSchema),
  wrapAsync(GradesControllers.listAdmin)
)
router.post(
  '/admin',
  requireAdmin,
  validate(createSchema),
  wrapAsync(GradesControllers.create)
)
router.put(
  '/admin/:id',
  requireAdmin,
  validate(updateSchema),
  wrapAsync(GradesControllers.update)
)
router.delete(
  '/admin/:id',
  requireAdmin,
  validate(gradeIdSchema),
  wrapAsync(GradesControllers.remove)
)
router.get(
  '/:id',
  requireUser,
  validate(gradeIdSchema),
  wrapAsync(GradesControllers.getById)
)

module.exports = { name: 'grades', router }
