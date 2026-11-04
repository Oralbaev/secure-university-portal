const express = require('express')
const CoursesControllers = require('./courses.controller')
const requireUser = require('../../helpers/auth/requireUser')
const requireAdmin = require('../../helpers/auth/requireAdmin')
const { validate } = require('../../helpers/validate')
const {
  createSchema,
  updateSchema,
  courseIdSchema
} = require('./courses.validator')
const { wrapAsync } = require('../../helpers/middlewares')
const router = express.Router()

router.get('/', requireUser, wrapAsync(CoursesControllers.list))
router.get(
  '/:id',
  requireUser,
  validate(courseIdSchema),
  wrapAsync(CoursesControllers.get)
)
router.post(
  '/',
  requireAdmin,
  validate(createSchema),
  wrapAsync(CoursesControllers.create)
)
router.put(
  '/:id',
  requireAdmin,
  validate(updateSchema),
  wrapAsync(CoursesControllers.update)
)
router.delete(
  '/:id',
  requireAdmin,
  validate(courseIdSchema),
  wrapAsync(CoursesControllers.remove)
)

module.exports = { name: 'courses', router }
