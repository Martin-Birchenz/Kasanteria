const CategoryRepository = require('../repositories/categoryRepository.js')

const CategoryService = {
    getCategories: async () => {
        return await CategoryRepository.getAll()
    },
    createCategory: async (name) => {
        if (!name || name.trim() === '') {
            throw new Error('El nombre de la categoría es obligatorio')
        }
        const slug = name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')
        return await CategoryRepository.create(name, slug)
    }
}

module.exports = CategoryService