/* eslint-disable no-console */
const mongoose = require('mongoose')
const config = require('../config')
const { Users } = require('../models')
const ROLES = require('../modules/users/helpers/roles')
const {
  hashPassword,
  generateTemporaryPassword,
  isStrongEnough
} = require('../helpers/utils/password')

/**
 * Bootstraps the first administrator. There is no self-registration, so without
 * this script nobody could ever create the account that creates the others.
 *
 * Usage:
 *   ADMIN_USERNAME=admin ADMIN_PASSWORD='...' npm run seed:admin
 * or let the script generate a password and print it once.
 */
async function seedAdmin() {
  await mongoose.connect(config.MONGO_DB_URL)

  const existingAdmin = await Users.findOne({ role: ROLES.ADMIN })

  if (existingAdmin) {
    console.error(
      `An administrator already exists ("${existingAdmin.username}"). ` +
        'Refusing to create a second one.'
    )
    process.exitCode = 1
    return
  }

  const username = (config.ADMIN_USERNAME || 'admin').trim().toLowerCase()
  const password = config.ADMIN_PASSWORD || generateTemporaryPassword(20)

  if (!isStrongEnough(password)) {
    console.error('ADMIN_PASSWORD must be between 10 and 128 characters.')
    process.exitCode = 1
    return
  }

  const passwordHash = await hashPassword(password)

  const admin = await Users.create({
    username,
    passwordHash,
    email: config.ADMIN_EMAIL,
    role: ROLES.ADMIN,
    status: 'active',
    mustChangePassword: !config.ADMIN_PASSWORD
  })

  console.log('Administrator created:')
  console.log(`  username: ${admin.username}`)
  console.log(`  password: ${password}`)
  if (!config.ADMIN_PASSWORD) {
    console.log('  (generated — it is not stored anywhere, save it now)')
  }
}

seedAdmin()
  .catch((error) => {
    console.error('Failed to seed administrator:', error.message)
    process.exitCode = 1
  })
  .finally(() => mongoose.disconnect())
