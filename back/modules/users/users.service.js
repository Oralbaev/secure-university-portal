const BaseService = require('../../helpers/base-service/BaseService')
const HttpError = require('../../helpers/errors/HttpError')
const { Users } = require('../../models')
const {
  hashPassword,
  generateTemporaryPassword,
  isStrongEnough
} = require('../../helpers/utils/password')

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

  async createWithPassword({ password, ...payload }) {
    if (!isStrongEnough(password)) {
      throw new HttpError(
        400,
        'Password must be 10 to 128 characters',
        'WEAK_PASSWORD'
      )
    }
    return this.create({
      ...payload,
      passwordHash: await hashPassword(password)
    })
  }

  async createWithTemporaryPassword(payload) {
    const temporaryPassword = generateTemporaryPassword(20)
    const user = await this.createWithPassword({
      ...payload,
      password: temporaryPassword
    })
    user.mustChangePassword = true
    await this.updateOne(
      { _id: user._id },
      { $set: { mustChangePassword: true } }
    )
    return { user, temporaryPassword }
  }

  async resetPassword(user, password) {
    const temporaryPassword = password || generateTemporaryPassword(20)
    if (!isStrongEnough(temporaryPassword)) {
      throw new HttpError(
        400,
        'Password must be 10 to 128 characters',
        'WEAK_PASSWORD'
      )
    }
    await this.updateOne(
      { _id: user._id },
      {
        $set: {
          passwordHash: await hashPassword(temporaryPassword),
          mustChangePassword: true
        },
        $inc: { tokenVersion: 1 }
      }
    )
    return temporaryPassword
  }
}

module.exports = new UsersService()
