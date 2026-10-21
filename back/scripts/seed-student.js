/* eslint-disable no-console */
const mongoose = require('mongoose')
const config = require('../config')
const { Users } = require('../models')
const ROLES = require('../modules/users/helpers/roles')
const { hashPassword, isStrongEnough } = require('../helpers/utils/password')

async function seedStudent() {
  if (config.NODE_ENV !== 'development') {
    throw new Error('The student seed is only available in development.')
  }

  const username = (process.env.SEED_STUDENT_USERNAME || 'student001')
    .trim()
    .toLowerCase()
  const password = process.env.SEED_STUDENT_PASSWORD || 'Student123!'
  if (!isStrongEnough(password)) {
    throw new Error('SEED_STUDENT_PASSWORD must be between 10 and 128 characters.')
  }

  await mongoose.connect(config.MONGO_DB_URL)
  const existing = await Users.findOne({ username })
  if (existing) {
    throw new Error(`Student "${username}" already exists; refusing to overwrite it.`)
  }

  await Users.create({
    username,
    passwordHash: await hashPassword(password),
    firstName: 'Demo',
    lastName: 'Student',
    role: ROLES.STUDENT,
    status: 'active'
  })
  console.log(`Development student created: ${username}`)
  if (!process.env.SEED_STUDENT_PASSWORD) {
    console.log('Development password: Student123!')
  }
}

seedStudent()
  .catch((error) => {
    console.error('Failed to seed student:', error.message)
    process.exitCode = 1
  })
  .finally(() => mongoose.disconnect())
