const coursesService = require('./courses.service')
const HttpError = require('../../helpers/errors/HttpError')
const { Users, Grades } = require('../../models')
const ROLES = require('../users/helpers/roles')

const toPublicCourse = (course) => {
  let teacher = null

  if (course.teacher) {
    if (typeof course.teacher === 'object' && course.teacher.username) {
      teacher = {
        id: course.teacher._id,
        username: course.teacher.username,
        firstName: course.teacher.firstName,
        lastName: course.teacher.lastName
      }
    } else {
      teacher = { id: course.teacher }
    }
  }

  return {
    id: course._id,
    code: course.code,
    title: course.title,
    credits: course.credits,
    teacher,
    description: course.description
  }
}

const findActiveTeacher = async (teacherId) => {
  const teacher = await Users.findOne({
    _id: teacherId,
    isDeleted: false,
    status: 'active',
    role: ROLES.TEACHER
  })

  if (!teacher) {
    throw new HttpError(
      400,
      'Teacher must be an active teacher account',
      'INVALID_TEACHER'
    )
  }

  return teacher
}

const CoursesControllers = {
  list: async (req, res) => {
    const courses = await coursesService.find({
      filter: {},
      sorter: { code: 1 }
    })

    return res.json({
      status: 'success',
      courses: courses.map(toPublicCourse)
    })
  },

  get: async (req, res) => {
    const course = await coursesService.findOneOrFail({
      filter: { _id: req.params.id }
    })

    return res.json({ status: 'success', course: toPublicCourse(course) })
  },

  create: async (req, res) => {
    const { title, credits, description } = req.body
    const code = req.body.code.trim().toUpperCase()
    const teacherId = req.body.teacher

    const existing = await coursesService.findOne({ filter: { code } })
    if (existing) {
      throw new HttpError(409, 'Course code is already in use', 'COURSE_EXISTS')
    }

    if (teacherId) {
      await findActiveTeacher(teacherId)
    }

    const course = await coursesService.create({
      code,
      title,
      credits,
      description,
      teacher: teacherId || null
    })

    return res.status(201).json({
      status: 'success',
      course: toPublicCourse(course)
    })
  },

  update: async (req, res) => {
    const { id } = req.params
    const { title, credits, description } = req.body
    const update = {}

    await coursesService.findOneOrFail({ filter: { _id: id } })

    if (req.body.code !== undefined) {
      const code = req.body.code.trim().toUpperCase()
      const duplicate = await coursesService.findOne({
        filter: { code, _id: { $ne: id } }
      })
      if (duplicate) {
        throw new HttpError(
          409,
          'Course code is already in use',
          'COURSE_EXISTS'
        )
      }
      update.code = code
    }

    if (title !== undefined) update.title = title
    if (credits !== undefined) update.credits = credits
    if (description !== undefined) update.description = description

    if (req.body.teacher !== undefined) {
      if (req.body.teacher === null) {
        update.teacher = null
      } else {
        await findActiveTeacher(req.body.teacher)
        update.teacher = req.body.teacher
      }
    }

    const course = await coursesService.findByIdAndUpdateOrFail(id, {
      data: { $set: update }
    })

    return res.json({ status: 'success', course: toPublicCourse(course) })
  },

  remove: async (req, res) => {
    const { id } = req.params

    await coursesService.findOneOrFail({ filter: { _id: id } })

    const gradeCount = await Grades.countDocuments({
      course: id,
      isDeleted: false
    })
    if (gradeCount > 0) {
      throw new HttpError(
        409,
        'Course has grades and cannot be deleted',
        'COURSE_IN_USE'
      )
    }

    await coursesService.deleteOneOrFail(id)

    return res.json({ status: 'success' })
  }
}

module.exports = CoursesControllers
