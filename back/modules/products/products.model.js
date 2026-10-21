const mongoose = require('mongoose')
const SCHEMAS = require('../../constants/schemas')
const timestamps = require('../../constants/timestamps')

const productsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    price: {
      type: Number,
      required: true
    },
    description: {
      type: String
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps }
)

module.exports = { schema: productsSchema, name: SCHEMAS.PRODUCTS }
