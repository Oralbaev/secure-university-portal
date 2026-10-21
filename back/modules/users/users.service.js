const BaseService = require('../../helpers/base-service/BaseService')
const HttpError = require('../../helpers/errors/HttpError')
const { Users } = require('../../models')

class UsersService extends BaseService {
  constructor() {
    super({
      Model: Users,
      defaulPopulateOptions: [],
      defaultSelectOptions: [],
      errorsEnum: {
        NOT_FOUND: new HttpError(404, 'User not found', 'USER_NOT_FOUND')
      }
    })
  }
}

module.exports = new UsersService()
