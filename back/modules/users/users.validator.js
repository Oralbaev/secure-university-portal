const { z } = require('zod')
const ROLES = require('./helpers/roles')
const { isValidId } = require('../../helpers/validate')

const loginSchema = z.object({
  body: z.object({
    username: z.string().trim().min(3).max(64),
    password: z.string().min(10).max(128)
  })
})

const adminCreateSchema = z.object({
  body: z.object({
    username: z.string().trim().min(3).max(64),
    password: z.string().min(10).max(128).optional(),
    role: z.enum(Object.values(ROLES)).optional(),
    email: z.string().email().optional(),
    phoneNumber: z.string().optional(),
    firstName: z.string().max(100).optional(),
    lastName: z.string().max(100).optional()
  })
})

const adminUpdateSchema = z.object({
  params: z.object({ id: z.string().refine(isValidId) }),
  body: z.object({
    email: z.string().email().optional(),
    phoneNumber: z.string().optional(),
    firstName: z.string().max(100).optional(),
    lastName: z.string().max(100).optional(),
    role: z.enum(Object.values(ROLES)).optional(),
    status: z.enum(['active', 'inactive']).optional()
  }).refine((body) => Object.keys(body).length > 0)
})

const adminIdSchema = z.object({
  params: z.object({ id: z.string().refine(isValidId) })
})
const resetPasswordSchema = adminIdSchema.extend({
  body: z.object({ password: z.string().min(10).max(128).optional() })
})
const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1).max(128),
    newPassword: z.string().min(10).max(128)
  })
})

module.exports = {
  loginSchema,
  adminCreateSchema,
  adminUpdateSchema,
  adminIdSchema,
  resetPasswordSchema,
  changePasswordSchema
}
