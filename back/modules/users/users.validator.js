const { z } = require('zod')
const { isValidId } = require('../../helpers/validate')

const loginSchema = z.object({
  body: z.object({
    phoneNumber: z.string().min(11).max(11)
  })
})

const checkSmsSchema = z.object({
  body: z.object({
    smsCode: z.string().min(4).max(4),
    id: z.string().refine(isValidId)
  })
})

const resendSmsSchema = z.object({
  body: z.object({
    id: z.string().refine(isValidId)
  })
})

module.exports = { loginSchema, checkSmsSchema, resendSmsSchema }
