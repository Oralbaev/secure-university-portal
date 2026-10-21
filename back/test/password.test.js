const assert = require('node:assert/strict')
const test = require('node:test')

const {
  generateTemporaryPassword,
  hashPassword,
  isStrongEnough,
  verifyPassword
} = require('../helpers/utils/password')

test('password hashes use unique salts and verify the original password', async () => {
  const password = 'CorrectHorseBattery!'
  const [firstHash, secondHash] = await Promise.all([
    hashPassword(password),
    hashPassword(password)
  ])

  assert.match(firstHash, /^scrypt\$[a-f\d]{32}\$[a-f\d]{128}$/i)
  assert.notEqual(firstHash, secondHash)
  assert.equal(await verifyPassword(password, firstHash), true)
  assert.equal(await verifyPassword(password, secondHash), true)
})

test('password verification rejects a wrong password or malformed hash', async () => {
  const hash = await hashPassword('CorrectHorseBattery!')

  assert.equal(await verifyPassword('WrongPassword!', hash), false)
  assert.equal(await verifyPassword('CorrectHorseBattery!', 'invalid'), false)
  assert.equal(await verifyPassword('', hash), false)
})

test('temporary passwords satisfy the configured length policy', () => {
  const password = generateTemporaryPassword(20)

  assert.equal(password.length, 20)
  assert.equal(isStrongEnough(password), true)
})

test('password policy accepts 10 to 128 characters only', () => {
  assert.equal(isStrongEnough('1234567890'), true)
  assert.equal(isStrongEnough('x'.repeat(128)), true)
  assert.equal(isStrongEnough('short'), false)
  assert.equal(isStrongEnough('x'.repeat(129)), false)
})
