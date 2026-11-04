const assert = require('node:assert/strict')
const test = require('node:test')

const {
  createSchema,
  updateSchema,
  adminListSchema
} = require('../modules/grades/grades.validator')
const {
  createSchema: createCourseSchema,
  updateSchema: updateCourseSchema
} = require('../modules/courses/courses.validator')

const studentId = '507f1f77bcf86cd799439011'
const courseId = '507f1f77bcf86cd799439012'

const validGrade = {
  studentId,
  courseId,
  semester: '2026-fall',
  score: 88
}

test('grade creation validates identifiers, semester and score', () => {
  assert.equal(createSchema.safeParse({ body: validGrade }).success, true)
  assert.equal(
    createSchema.safeParse({ body: { ...validGrade, score: 101 } }).success,
    false
  )
  assert.equal(
    createSchema.safeParse({ body: { ...validGrade, score: -1 } }).success,
    false
  )
  assert.equal(
    createSchema.safeParse({
      body: { ...validGrade, semester: '2026-autumn' }
    }).success,
    false
  )
  assert.equal(
    createSchema.safeParse({
      body: { ...validGrade, studentId: 'not-an-object-id' }
    }).success,
    false
  )
})

test('grade updates require at least one allowed field', () => {
  assert.equal(
    updateSchema.safeParse({ params: { id: studentId }, body: { score: 90 } })
      .success,
    true
  )
  assert.equal(
    updateSchema.safeParse({ params: { id: studentId }, body: {} }).success,
    false
  )
})

test('admin grade listing accepts pagination strings and rejects invalid values', () => {
  assert.equal(
    adminListSchema.safeParse({
      query: { page: '2', limit: '10', semester: '2026-fall' }
    }).success,
    true
  )
  assert.equal(
    adminListSchema.safeParse({ query: { page: '0' } }).success,
    false
  )
  assert.equal(
    adminListSchema.safeParse({ query: { studentId: 'bad-id' } }).success,
    false
  )
})

test('course creation validates credits and identifiers', () => {
  assert.equal(
    createCourseSchema.safeParse({
      body: { code: 'CS-101', title: 'Intro', credits: 3 }
    }).success,
    true
  )
  assert.equal(
    createCourseSchema.safeParse({
      body: { code: 'CS-101', title: 'Intro', credits: 0 }
    }).success,
    false
  )
  assert.equal(
    createCourseSchema.safeParse({
      body: { code: 'CS-101', title: 'Intro', credits: 3, teacher: 'bad-id' }
    }).success,
    false
  )
})

test('course updates reject an empty body', () => {
  assert.equal(
    updateCourseSchema.safeParse({
      params: { id: courseId },
      body: {}
    }).success,
    false
  )
})
