const { z } = require('zod')
const { isValidId } = require('../../helpers/validate')

const createSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(255),
    price: z.number().min(0),
    description: z.string().min(3).max(255),
  })
})

const getSchema = z.object({
    query: z.object({
        id: z.string().refine(isValidId).optional()
    })
})

const updateSchema = z.object({
    query: z.object({
        id: z.string().refine(isValidId)
    }),
    body: z.object({
        name: z.string().min(3).max(255).optional(),
        price: z.number().min(0).optional(),
        description: z.string().min(3).max(255).optional(),
    })
})

const deleteSchema = z.object({
    query: z.object({
        id: z.string().refine(isValidId)
    })
})

module.exports = { createSchema, getSchema, updateSchema, deleteSchema }
