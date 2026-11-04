const BaseService = require('../../helpers/base-service/BaseService')
const HttpError = require('../../helpers/errors/HttpError')
const { Grades } = require('../../models')

class GradesService extends BaseService {
  constructor() {
    super({
      Model: Grades,
      defaulPopulateOptions: [
        { path: 'course', select: 'code title credits teacher' }
      ],
      defaultSelectOptions: [],
      errorsEnum: {
        NOT_FOUND: new HttpError(404, 'Grade not found', 'GRADE_NOT_FOUND')
      }
    })
  }
}

module.exports = new GradesService()
