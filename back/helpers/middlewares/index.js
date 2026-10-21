const config = require('../../config')

async function tgSendLog({ message, requestPath }) {
  if (!config.TELEGRAM_BOT_TOKEN || !config.TELEGRAM_CHAT_ID) {
    return
  }

  const res = await fetch(
    `https://api.telegram.org/bot${config.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: config.TELEGRAM_CHAT_ID,
        // Telegram caps messages at 4096 characters
        text: `🆘 ERROR\nREQUEST PATH: ${requestPath}\n\n${message}`.slice(0, 4096)
      })
    }
  )

  if (!res.ok) {
    throw new Error(`Telegram sendMessage failed with status ${res.status}`)
  }
}

async function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err)
  }

  if (err.status && err.status < 500) {
    return res
      .status(err.status)
      .send({ err: err.message, code: err.code, extra: err.extra })
  }

  if (err.response) {
    return res
      .status(err.response.status)
      .send({ err: { ru: err.response.data } })
  }

  // MongoDB duplicate key, e.g. a product name that already exists
  if (err.code === 11000) {
    return res
      .status(409)
      .send({ err: 'Duplicate value', code: 'DUPLICATE_KEY', extra: err.keyValue })
  }

  if (err.name === 'CastError' || err.name === 'ValidationError') {
    return res.status(400).send({ err: err.message, code: 'INVALID_INPUT' })
  }

  console.error(err)

  if (config.NODE_ENV === 'production') {
    await tgSendLog({
      message: err.stack,
      requestPath: req?.path
    }).catch((logErr) => console.error('Telegram log failed:', logErr.message))
  }

  return res
    .status(err.status || 500)
    .send({ err: err.status ? err.message : 'Internal server error', code: err.code })
}

function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(next)
  }
}

module.exports = {
  tgSendLog,
  errorHandler,
  wrapAsync
}
