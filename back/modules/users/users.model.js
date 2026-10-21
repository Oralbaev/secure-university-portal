const mongoose = require('mongoose')
const SCHEMAS = require('../../constants/schemas')
const timestamps = require('../../constants/timestamps')
const ROLES = require('./helpers/roles')

const userSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
      minlength: 11,
      maxlength: 11
    },
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    smsCode: {
      type: String
    },
    smsCodeExpiresAt: {
      type: Date
    },
    smsAttempts: {
      type: Number,
      default: 0
    },
    smsSentAt: {
      type: Date
    },
    tokenVersion: {
      type: Number,
      default: 0
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    loggedIn: {
      type: Boolean,
      default: false
    },
    role: { type: String, default: ROLES.USER, enum: Object.values(ROLES) }
  },
  { timestamps }
)

module.exports = { schema: userSchema, name: SCHEMAS.USERS }
