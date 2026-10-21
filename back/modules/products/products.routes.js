const express = require('express')
const ProductsControllers = require('./products.controller')
const requireUser = require('../../helpers/auth/requireUser')
const requireAdmin = require('../../helpers/auth/requireAdmin')
const { validate } = require('../../helpers/validate')
const { createSchema, getSchema, updateSchema, deleteSchema } = require('./products.validator')
const { wrapAsync } = require('../../helpers/middlewares')
const router = express.Router()

router.post('/', requireAdmin, validate(createSchema), wrapAsync(ProductsControllers.create))

router.get('/', validate(getSchema), wrapAsync(ProductsControllers.get))

router.put('/', requireAdmin, validate(updateSchema), wrapAsync(ProductsControllers.update))

router.delete('/', requireAdmin, validate(deleteSchema), wrapAsync(ProductsControllers.delete))

module.exports = { name: 'products', router }