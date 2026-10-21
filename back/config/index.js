require('dotenv').config()

const config = {
  SECRET_KEY: process.env.SECRET_KEY,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  ADMIN_USERNAME: process.env.ADMIN_USERNAME,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  MONGO_DB_URL: process.env.MONGO_DB_URL,
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  CORS_ORIGINS: (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim()),
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
  PS_CLOUD_URL: process.env.PS_CLOUD_URL,
  PS_CLOUD_ACCESS_KEY: process.env.PS_CLOUD_ACCESS_KEY,
  PS_CLOUD_SECRET_KEY: process.env.PS_CLOUD_SECRET_KEY,
  TEMP_FILES_DIR: process.env.TEMP_FILES_DIR
}

if (
  config.NODE_ENV === 'production' &&
  (!config.SECRET_KEY || Buffer.byteLength(config.SECRET_KEY) < 32)
) {
  throw new Error('SECRET_KEY must contain at least 32 bytes in production')
}

module.exports = config
