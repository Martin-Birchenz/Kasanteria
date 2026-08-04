const CategoryService = require('../services/categoryService.js')

const CategoryController = {
    getCategory: async (req, res) => {
        try {
            const categories = await CategoryService.getCategories()
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener las categorías' })
        }
    },

    createCategory: async (req, res) => {
        try {
            const { name } = req.body
            const newCategory = await CategoryService.createCategory(name)
            res.status(201).json({
                message: 'Categoría creada con éxito',
                data: newCategory
            })
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    }
}

module.exports = CategoryController