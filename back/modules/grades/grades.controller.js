const gradesService = require('./grades.service')
const coursesService = require('../courses/courses.service')
const HttpError = require('../../helpers/errors/HttpError')
const { Users } = require('../../models')
const { canViewGrade, canManageGrades } = require('./helpers/access')
const { gradeFromScore, calculateSummary } = require('./helpers/grade-scale')
const ROLES = require('../users/helpers/roles')

const coursePopulate = [
  { path: 'course', select: 'code title credits teacher' }
]

const presentGrade = (grade) => {
  const scale = gradeFromScore(grade.score) || {
    letter: 'F',
    points: 0,
    passed: false
  }
  const course = grade.course
    ? {
        id: grade.course._id,
        code: grade.course.code,
        title: grade.course.title,
        credits: grade.course.credits
      }
    : null

  return {
    id: grade._id,
    course,
    semester: grade.semester,
    score: grade.score,
    letterGrade: scale.letter,
    gradePoints: scale.points,
    passed: scale.passed
  }
}

const loadGrade = async (id) => {
  const grade = await gradesService.findOne({
    filter: { _id: id },
    populate: coursePopulate
  })

  if (!grade) {
    throw new HttpError(404, 'Grade not found', 'GRADE_NOT_FOUND')
  }

  return grade
}

const GradesControllers = {
  getMine: async (req, res) => {
    // The student identity comes only from the authenticated session. A
    // client-supplied student ID is never read on this route.
    const grades = await gradesService.find({
      filter: { student: req.user._id },
      populate: coursePopulate,
      sorter: { semester: -1, created_at: -1 }
    })
    const presented = grades.map(presentGrade)

    return res.json({
      status: 'success',
      grades: presented,
      summary: calculateSummary(presented)
    })
  },

  getById: async (req, res) => {
    const grade = await loadGrade(req.params.id)

    if (!canViewGrade(req.user, grade)) {
      // Do not reveal whether somebody else's grade record exists.
      throw new HttpError(404, 'Grade not found', 'GRADE_NOT_FOUND')
    }

    return res.json({ status: 'success', grade: presentGrade(grade) })
  },

  getTeacher: async (req, res) => {
    const courses = await coursesService.find({
      filter: { teacher: req.user._id },
      select: ['_id'],
      populate: []
    })

    if (courses.length === 0) {
      return res.json({ status: 'success', grades: [] })
    }

    const grades = await gradesService.find({
      filter: { course: { $in: courses.map((course) => course._id) } },
      populate: coursePopulate,
      sorter: { semester: -1, created_at: -1 }
    })

    return res.json({
      status: 'success',
      grades: grades.map(presentGrade)
    })
  },

  listAdmin: async (req, res) => {
    const { studentId, courseId, semester, page, limit } = req.query
    const filter = {}

    if (studentId) filter.student = studentId
    if (courseId) filter.course = courseId
    if (semester) filter.semester = semester.toLowerCase()

    const result = await gradesService.paginate({
      filter,
      populate: coursePopulate,
      sorter: { semester: -1, created_at: -1 },
      pagination: {
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined
      }
    })

    return res.json({
      status: 'success',
      grades: result.docs.map(presentGrade),
      pagination: {
        total: result.totalDocs,
        page: result.page,
        pages: result.totalPages
      }
    })
  },

  create: async (req, res) => {
    const { studentId, courseId, score } = req.body
    const semester = req.body.semester.toLowerCase()

    const student = await Users.findOne({
      _id: studentId,
      isDeleted: false,
      status: 'active',
      role: ROLES.STUDENT
    })
    if (!student) {
      throw new HttpError(
        400,
        'Student must be an active student account',
        'INVALID_STUDENT'
      )
    }

    const course = await coursesService.findOne({ filter: { _id: courseId } })
    if (!course) {
      throw new HttpError(400, 'Course not found', 'INVALID_COURSE')
    }

    const existing = await gradesService.findOne({
      filter: { student: studentId, course: courseId, semester }
    })
    if (existing) {
      throw new HttpError(
        409,
        'A grade already exists for this student, course and semester',
        'GRADE_EXISTS'
      )
    }

    const created = await gradesService.create({
      student: studentId,
      course: courseId,
      semester,
      score
    })
    const grade = await loadGrade(created._id)

    return res.status(201).json({
      status: 'success',
      grade: presentGrade(grade)
    })
  },

  update: async (req, res) => {
    if (!canManageGrades(req.user)) {
      throw new HttpError(403, 'Forbidden request', 'FORBIDDEN')
    }

    const grade = await loadGrade(req.params.id)
    const update = {}

    if (req.body.score !== undefined) update.score = req.body.score

    if (req.body.semester !== undefined) {
      const semester = req.body.semester.toLowerCase()
      const courseId = grade.course?._id || grade.course
      const duplicate = await gradesService.findOne({
        filter: {
          student: grade.student,
          course: courseId,
          semester,
          _id: { $ne: grade._id }
        }
      })
      if (duplicate) {
        throw new HttpError(
          409,
          'A grade already exists for this student, course and semester',
          'GRADE_EXISTS'
        )
      }
      update.semester = semester
    }

    const updated = await gradesService.findByIdAndUpdateOrFail(grade._id, {
      data: { $set: update },
      populate: coursePopulate
    })

    return res.json({ status: 'success', grade: presentGrade(updated) })
  },

  remove: async (req, res) => {
    const grade = await loadGrade(req.params.id)
    await gradesService.deleteOneOrFail(grade._id)

    return res.json({ status: 'success' })
  }
}

module.exports = GradesControllers
