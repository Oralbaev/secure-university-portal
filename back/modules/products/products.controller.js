const productsService = require('./products.service')

const ProductsControllers = {
    create: async (req, res) => {
        const { name, price, description } = req.body

        const product = await productsService.create({ name, price, description })

        return res.status(201).json({ status: 'success', id: product._id })
    },
    // Without ?id= this lists all products
    get: async (req, res) => {
        const { id } = req.query

        const products = await productsService.find({ filter: { _id: id, isDeleted: false } })

        return res.status(200).json({ status: 'success', products })
    },
    update: async (req, res) => {
        const { id } = req.query
        const { name, price, description } = req.body

        const product = await productsService.findByIdAndUpdateOrFail(id, {
            data: { $set: { name, price, description } }
        })

        return res.status(200).json({ status: 'success', id: product._id })
    },
    delete: async (req, res) => {
        const { id } = req.query

        await productsService.deleteOneOrFail(id)

        return res.status(200).json({ status: 'success' })
    }
}

module.exports = ProductsControllers
