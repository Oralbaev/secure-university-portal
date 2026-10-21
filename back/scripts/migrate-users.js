/* eslint-disable no-console */
const mongoose = require('mongoose')
const config = require('../config')
const { Users } = require('../models')
const {
  hashPassword,
  generateTemporaryPassword
} = require('../helpers/utils/password')

/**
 * Migrates users created by the old phone + SMS-OTP scheme to the new
 * username + password scheme.
 *
 * The old schema had no password, so there is nothing to hash: every migrated
 * account gets a random temporary password and `mustChangePassword`, so the
 * owner has to set a new one on first login.
 */
async function migrateUsers() {
  await mongoose.connect(config.MONGO_DB_URL)

  const users = await Users.find({}).select('+passwordHash')

  let migrated = 0

  for (const user of users) {
    const set = {}
    const unset = {}

    // The old records only had a phone number; use it as the username seed.
    if (!user.username && user.phoneNumber) {
      set.username = String(user.phoneNumber).trim().toLowerCase()
    }

    if (!user.passwordHash) {
      set.passwordHash = await hashPassword(generateTemporaryPassword(20))
      set.mustChangePassword = true
    }

    if (!user.status) {
      set.status = 'active'
    }

    // The old role enum only knew 'user'.
    if (!['admin', 'teacher', 'staff', 'student'].includes(user.role)) {
      set.role = 'student'
    }

    for (const field of [
      'smsCode',
      'smsCodeExpiresAt',
      'smsAttempts',
      'smsSentAt'
    ]) {
      unset[field] = ''
    }

    const update = {}
    if (Object.keys(set).length) update.$set = set
    if (Object.keys(unset).length) update.$unset = unset

    if (!Object.keys(update).length) continue

    await Users.updateOne({ _id: user._id }, update)
    migrated++
  }

  console.log(`Migrated ${migrated} user(s).`)
  console.log('Every migrated account needs a password reset by an admin.')
}

migrateUsers()
  .catch((error) => {
    console.error('Migration failed:', error.message)
    process.exitCode = 1
  })
  .finally(() => mongoose.disconnect())
