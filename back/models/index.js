const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

// Load only the application models that are part of this backend. Avoid
// building require() paths from directory entries at runtime.
const models = [
  require('../modules/products/products.model'),
  require('../modules/users/users.model'),
]

models.forEach((model) => {
  if (model) {
    model.schema.plugin(mongoosePaginate)
    const Model = mongoose.model(model.name, model.schema)
    module.exports[model.name] = Model
  }
})
