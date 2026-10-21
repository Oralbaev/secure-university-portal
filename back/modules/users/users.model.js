const mongoose = require('mongoose')
const SCHEMAS = require('../../constants/schemas')
const timestamps = require('../../constants/timestamps')
const ROLES = require('./helpers/roles')

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
      sparse: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 64
    },
    passwordHash: { type: String, required: true, select: false },
    email: { type: String },
    phoneNumber: { type: String },
    firstName: {
      type: String
    },
    lastName: {
      type: String
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
    role: { type: String, default: ROLES.STUDENT, enum: Object.values(ROLES) },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    mustChangePassword: { type: Boolean, default: false }
  },
  { timestamps }
)

module.exports = { schema: userSchema, name: SCHEMAS.USERS }
