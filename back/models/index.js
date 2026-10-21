const fs = require('fs')
const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const path = require('path')

const modulesDirectory = path.join(__dirname, '../modules')
const moduleFiles = fs.readdirSync(modulesDirectory)

moduleFiles.forEach((file) => {
  const filePath = path.join(modulesDirectory, file, `${file}.model.js`)
  const model = require(filePath)
  if (model) {
    model.schema.plugin(mongoosePaginate)
    const Model = mongoose.model(model.name, model.schema)
    module.exports[model.name] = Model
  }
})
