const BaseService = require('../../helpers/base-service/BaseService')
const HttpError = require('../../helpers/errors/HttpError')
const { Products } = require('../../models')

class ProductsService extends BaseService {
  constructor() {
    super({
      Model: Products,
      defaulPopulateOptions: [],
      defaultSelectOptions: [],
      errorsEnum: {
        NOT_FOUND: new HttpError(404, 'Product not found', 'PRODUCT_NOT_FOUND')
      }
    })
  }
}

module.exports = new ProductsService()
