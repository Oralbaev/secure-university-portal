const crypto = require('crypto')
const { promisify } = require('util')

const scrypt = promisify(crypto.scrypt)
const SCRYPT_OPTIONS = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 }
const MIN_PASSWORD_LENGTH = 10
const MAX_PASSWORD_LENGTH = 128

/**
 * Derives a salted scrypt hash suitable for storing passwords.
 */
const hashPassword = async (password) => {
  const salt = crypto.randomBytes(16)
  const hash = await scrypt(password, salt, 64, SCRYPT_OPTIONS)
  return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`
}

/**
 * Verifies a password against a stored hash. Never throws: a malformed or
 * missing hash is simply a failed verification.
 *
 * @param {string} password
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
const verifyPassword = async (password, hash) => {
  if (!password || !hash) return false

  try {
    const [algorithm, saltHex, hashHex] = hash.split('$')
    if (
      algorithm !== 'scrypt' ||
      !/^[a-f\d]{32}$/i.test(saltHex) ||
      !/^[a-f\d]{128}$/i.test(hashHex)
    ) {
      return false
    }
    const expected = Buffer.from(hashHex, 'hex')
    const actual = await scrypt(
      password,
      Buffer.from(saltHex, 'hex'),
      expected.length,
      SCRYPT_OPTIONS
    )
    return crypto.timingSafeEqual(actual, expected)
  } catch {
    return false
  }
}

/**
 * @param {string} password
 * @returns {boolean} whether the password meets the minimum policy
 */
const isStrongEnough = (password) =>
  typeof password === 'string' &&
  password.length >= MIN_PASSWORD_LENGTH &&
  password.length <= MAX_PASSWORD_LENGTH

/**
 * Generates a cryptographically random temporary password for accounts that
 * an admin provisions. Uses a readable alphabet so it can be typed by hand.
 *
 * @param {number} length
 * @returns {string}
 */
const generateTemporaryPassword = (length = 16) => {
  const alphabet =
    'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%'
  const bytes = crypto.randomBytes(length)
  let password = ''

  for (let i = 0; i < length; i++) {
    password += alphabet[bytes[i] % alphabet.length]
  }

  return password
}

module.exports = {
  hashPassword,
  verifyPassword,
  isStrongEnough,
  generateTemporaryPassword,
  MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH
}
