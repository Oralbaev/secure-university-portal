const assert = require('node:assert/strict')
const test = require('node:test')

const requireAdmin = require('../helpers/auth/requireAdmin')
const checkAdminRole = requireAdmin[1]

const authorize = (user) => {
  const response = {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code
      return this
    },
    send(body) {
      this.body = body
      return this
    },
  }
  let continued = false

  checkAdminRole({ user }, response, () => {
    continued = true
  })

  return { response, continued }
}

test('an unauthenticated request is rejected by the admin guard', () => {
  const { response, continued } = authorize(undefined)

  assert.equal(response.statusCode, 401)
  assert.equal(continued, false)
})

test('Student and Teacher cannot use admin-only routes', () => {
  for (const role of ['student', 'teacher']) {
    const { response, continued } = authorize({ role, isDeleted: false })

    assert.equal(response.statusCode, 403)
    assert.equal(continued, false)
  }
})

test('an active Admin is allowed through the admin guard', () => {
  const { response, continued } = authorize({ role: 'admin', isDeleted: false })

  assert.equal(response.statusCode, null)
  assert.equal(continued, true)
})
