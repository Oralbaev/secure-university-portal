const assert = require('node:assert/strict')
const test = require('node:test')

const {
  canViewGrade,
  canManageGrades
} = require('../modules/grades/helpers/access')

const studentId = '507f1f77bcf86cd799439011'
const otherStudentId = '507f1f77bcf86cd799439012'
const teacherId = '507f1f77bcf86cd799439013'
const otherTeacherId = '507f1f77bcf86cd799439014'
const courseId = '507f1f77bcf86cd799439015'

const grade = {
  student: studentId,
  course: { _id: courseId, teacher: teacherId }
}

test('an unauthenticated request cannot view a grade', () => {
  assert.equal(canViewGrade(undefined, grade), false)
})

test('a student can view their own grade', () => {
  const student = { _id: studentId, role: 'student' }

  assert.equal(canViewGrade(student, grade), true)
})

test('a student cannot view another student grade', () => {
  const student = { _id: otherStudentId, role: 'student' }

  assert.equal(canViewGrade(student, grade), false)
})

test('a teacher can view grades for a course they teach', () => {
  const teacher = { _id: teacherId, role: 'teacher' }

  assert.equal(canViewGrade(teacher, grade), true)
})

test('a teacher cannot view grades for another teacher course', () => {
  const teacher = { _id: otherTeacherId, role: 'teacher' }

  assert.equal(canViewGrade(teacher, grade), false)
})

test('a teacher cannot view a grade when the course is not populated', () => {
  const teacher = { _id: teacherId, role: 'teacher' }
  const unpopulatedGrade = { student: studentId, course: courseId }

  assert.equal(canViewGrade(teacher, unpopulatedGrade), false)
})

test('an admin can view any grade', () => {
  const admin = { _id: '507f1f77bcf86cd799439016', role: 'admin' }

  assert.equal(canViewGrade(admin, grade), true)
})

test('only an admin can manage grades', () => {
  assert.equal(canManageGrades({ _id: '1', role: 'admin' }), true)
  assert.equal(canManageGrades({ _id: '2', role: 'teacher' }), false)
  assert.equal(canManageGrades({ _id: '3', role: 'student' }), false)
  assert.equal(canManageGrades(undefined), false)
})
