const config = require('../../config')
const HttpError = require('../errors/HttpError')

/**
 * Sends an SMS. No provider is wired up yet: outside production the message
 * is printed to the console, in production the request fails loudly instead
 * of pretending the code was delivered.
 */
async function sendSms({ phoneNumber, text }) {
  if (config.NODE_ENV !== 'production') {
    console.log(`[sms] to ${phoneNumber}: ${text}`)
    return
  }

  throw new HttpError(
    503,
    'SMS provider is not configured',
    'SMS_NOT_CONFIGURED'
  )
}

module.exports = { sendSms }
