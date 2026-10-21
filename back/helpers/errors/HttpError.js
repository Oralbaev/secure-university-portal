class HttpError extends Error {
  constructor(status, message, code, extra) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.code = code
    this.extra = extra
  }
}

module.exports = HttpError
