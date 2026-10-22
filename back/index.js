const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')

const config = require('./config')
const { errorHandler } = require('./helpers/middlewares')

// Authenticated API requests use explicit Bearer JWTs, not browser cookies;
// cookie-based CSRF protection is not applicable to the current auth flow.
const app = express() // nosemgrep: javascript.express.security.audit.express-check-csurf-middleware-usage.express-check-csurf-middleware-usage
require('./models')

mongoose.connect(config.MONGO_DB_URL).catch((err) => {
  console.error('MongoDB connection failed:', err.message)
  process.exit(1)
})

require('./config/passport')(passport)

app.use(passport.initialize())

app.use(cors({ origin: config.CORS_ORIGINS }))

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true }))

require('./routes')(app)

app.use(errorHandler)

const host = config.NODE_ENV === 'development' ? '127.0.0.1' : '0.0.0.0'

app.listen(config.PORT, host, () => {
  console.log(
    `App listening on ${host}:${config.PORT} on ${config.NODE_ENV} environment`
  )
})
