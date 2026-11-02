const assert = require('node:assert/strict')
const test = require('node:test')

const {
  gradeFromScore,
  calculateSummary
} = require('../modules/grades/helpers/grade-scale')

test('scores are converted to the correct letter grades', () => {
  assert.deepEqual(gradeFromScore(95), {
    letter: 'A',
    points: 4,
    passed: true
  })
  assert.equal(gradeFromScore(90).letter, 'A')
  assert.equal(gradeFromScore(89.9).letter, 'A-')
  assert.equal(gradeFromScore(80).letter, 'B+')
  assert.equal(gradeFromScore(75).letter, 'B')
  assert.equal(gradeFromScore(70).letter, 'B-')
  assert.equal(gradeFromScore(65).letter, 'C+')
  assert.equal(gradeFromScore(60).letter, 'C')
  assert.equal(gradeFromScore(55).letter, 'C-')
  assert.equal(gradeFromScore(50).letter, 'D')
  assert.equal(gradeFromScore(49.9).letter, 'F')
  assert.equal(gradeFromScore(49.9).passed, false)
})

test('out-of-range scores do not produce a grade', () => {
  assert.equal(gradeFromScore(-1), null)
  assert.equal(gradeFromScore(101), null)
  assert.equal(gradeFromScore('not-a-number'), null)
})

test('the summary calculates credits and weighted GPA', () => {
  const summary = calculateSummary([
    { course: { credits: 4 }, gradePoints: 4, passed: true },
    { course: { credits: 3 }, gradePoints: 2, passed: true },
    { course: { credits: 2 }, gradePoints: 0, passed: false }
  ])

  assert.deepEqual(summary, {
    totalCredits: 9,
    earnedCredits: 7,
    gpa: 2.44,
    courses: 3
  })
})

test('the summary handles an empty transcript', () => {
  assert.deepEqual(calculateSummary([]), {
    totalCredits: 0,
    earnedCredits: 0,
    gpa: null,
    courses: 0
  })
})
