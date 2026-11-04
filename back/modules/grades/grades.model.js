const mongoose = require('mongoose')
const SCHEMAS = require('../../constants/schemas')
const timestamps = require('../../constants/timestamps')

const gradesSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: SCHEMAS.USERS,
      required: true,
      index: true
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: SCHEMAS.COURSES,
      required: true,
      index: true
    },
    semester: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: /^\d{4}-(spring|summer|fall|winter)$/
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps }
)

// A student can have only one active result per course and semester. The
// partial index allows the same pair to be reused after a soft delete.
gradesSchema.index(
  { student: 1, course: 1, semester: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } }
)

module.exports = { schema: gradesSchema, name: SCHEMAS.GRADES }
