const mongoose = require('mongoose')
const SCHEMAS = require('../../constants/schemas')
const timestamps = require('../../constants/timestamps')

const coursesSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      minlength: 2,
      maxlength: 16
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 160
    },
    credits: {
      type: Number,
      required: true,
      min: 1,
      max: 30
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: SCHEMAS.USERS,
      default: null
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps }
)

// A code can be reused after the previous course is soft-deleted, but two
// active courses must never share one.
coursesSchema.index(
  { code: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } }
)

module.exports = { schema: coursesSchema, name: SCHEMAS.COURSES }
