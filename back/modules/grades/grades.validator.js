const { z } = require('zod')
const { isValidId } = require('../../helpers/validate')

const objectId = z.string().refine(isValidId)
const semester = z
  .string()
  .trim()
  .regex(/^\d{4}-(spring|summer|fall|winter)$/i, 'Invalid semester format')
const pageNumber = z.coerce.number().int().min(1).max(1000)

const gradeIdSchema = z.object({
  params: z.object({ id: objectId })
})

const createSchema = z.object({
  body: z.object({
    studentId: objectId,
    courseId: objectId,
    semester,
    score: z.number().min(0).max(100)
  })
})

const updateSchema = z.object({
  params: z.object({ id: objectId }),
  body: z
    .object({
      semester: semester.optional(),
      score: z.number().min(0).max(100).optional()
    })
    .refine((body) => Object.keys(body).length > 0, {
      message: 'At least one field must be provided'
    })
})

const adminListSchema = z.object({
  query: z.object({
    studentId: objectId.optional(),
    courseId: objectId.optional(),
    semester: semester.optional(),
    page: pageNumber.optional(),
    limit: pageNumber.optional()
  })
})

module.exports = {
  gradeIdSchema,
  createSchema,
  updateSchema,
  adminListSchema
}
