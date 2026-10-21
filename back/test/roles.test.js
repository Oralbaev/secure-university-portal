const assert = require('node:assert/strict')
const test = require('node:test')

const ROLES = require('../modules/users/helpers/roles')

test('identity management includes Student, Teacher, and Admin roles', () => {
  assert.equal(ROLES.STUDENT, 'student')
  assert.equal(ROLES.TEACHER, 'teacher')
  assert.equal(ROLES.ADMIN, 'admin')
})
