const { z } = require('zod')
const { isValidId } = require('../../helpers/validate')

const courseCodeSchema = z
  .string()
  .trim()
  .min(2)
  .max(16)
  .regex(/^[a-zA-Z0-9-]+$/, 'Course code may only contain letters, numbers and dashes')

const courseFields = {
  code: courseCodeSchema.optional(),
  title: z.string().trim().min(2).max(160).optional(),
  credits: z.number().int().min(1).max(30).optional(),
  teacher: z.string().refine(isValidId).nullable().optional(),
  description: z.string().trim().max(1000).optional()
}

const courseIdSchema = z.object({
  params: z.object({ id: z.string().refine(isValidId) })
})

const createSchema = z.object({
  body: z.object({
    ...courseFields,
    code: courseCodeSchema,
    title: z.string().trim().min(2).max(160),
    credits: z.number().int().min(1).max(30)
  })
})

const updateSchema = z.object({
  params: z.object({ id: z.string().refine(isValidId) }),
  body: z
    .object(courseFields)
    .refine((body) => Object.keys(body).length > 0, {
      message: 'At least one field must be provided'
    })
})

module.exports = { createSchema, updateSchema, courseIdSchema }
