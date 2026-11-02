const BaseService = require('../../helpers/base-service/BaseService')
const HttpError = require('../../helpers/errors/HttpError')
const { Courses } = require('../../models')

class CoursesService extends BaseService {
  constructor() {
    super({
      Model: Courses,
      defaulPopulateOptions: [
        { path: 'teacher', select: 'username firstName lastName' }
      ],
      defaultSelectOptions: [],
      errorsEnum: {
        NOT_FOUND: new HttpError(404, 'Course not found', 'COURSE_NOT_FOUND')
      }
    })
  }
}

module.exports = new CoursesService()
