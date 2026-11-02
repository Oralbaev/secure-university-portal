/* eslint-disable no-console */
const mongoose = require('mongoose')
const config = require('../config')
const { Users, Courses, Grades } = require('../models')
const ROLES = require('../modules/users/helpers/roles')

const demoCourses = [
  {
    code: 'MATH101',
    title: 'Calculus I',
    credits: 4,
    description: 'Limits, derivatives and integrals.'
  },
  {
    code: 'PHYS101',
    title: 'Physics I',
    credits: 4,
    description: 'Mechanics, motion and energy.'
  },
  {
    code: 'CS101',
    title: 'Introduction to Programming',
    credits: 3,
    description: 'Programming fundamentals and problem solving.'
  }
]

const demoScores = {
  MATH101: 92,
  PHYS101: 84,
  CS101: 78
}

/**
 * Creates a small academic record set for the development student. The script
 * is idempotent and refuses to run outside development.
 *
 * Usage:
 *   npm run seed:student
 *   npm run seed:academics
 *
 * Set SEED_TEACHER_USERNAME to attach an existing teacher account to the demo
 * courses. Set SEED_SEMESTER to change the default semester.
 */
async function seedAcademics() {
  if (config.NODE_ENV !== 'development') {
    throw new Error('The academic seed is only available in development.')
  }

  const username = (process.env.SEED_STUDENT_USERNAME || 'student001')
    .trim()
    .toLowerCase()
  const teacherUsername = (process.env.SEED_TEACHER_USERNAME || '')
    .trim()
    .toLowerCase()
  const semester = (process.env.SEED_SEMESTER || '2026-fall').toLowerCase()

  await mongoose.connect(config.MONGO_DB_URL)

  const student = await Users.findOne({
    username,
    role: ROLES.STUDENT,
    isDeleted: false
  })
  if (!student) {
    throw new Error(
      'Development student account was not found. Run "npm run seed:student" first.'
    )
  }

  let teacher = null
  if (teacherUsername) {
    teacher = await Users.findOne({
      username: teacherUsername,
      role: ROLES.TEACHER,
      status: 'active',
      isDeleted: false
    })
    if (!teacher) {
      console.warn(
        'Requested teacher account was not found; demo courses will have no teacher.'
      )
    }
  }

  let gradeCount = 0
  for (const course of demoCourses) {
    const savedCourse = await Courses.findOneAndUpdate(
      { code: course.code, isDeleted: false },
      {
        $set: {
          ...course,
          teacher: teacher ? teacher._id : null,
          isDeleted: false
        }
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )

    await Grades.findOneAndUpdate(
      {
        student: student._id,
        course: savedCourse._id,
        semester,
        isDeleted: false
      },
      { $set: { score: demoScores[course.code], isDeleted: false } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )
    gradeCount++
  }

  console.log(
    `Academic demo data ready (${gradeCount} demo courses).`
  )
}

seedAcademics()
  .catch((error) => {
    console.error('Failed to seed academic data:', error.message)
    process.exitCode = 1
  })
  .finally(() => mongoose.disconnect())
