const SubcategoryRepository = require("../repositories/subcategoryRepository.js");

const SubcategoryService = {
  getAllSubcategories: async (categoryId) => {
    return await SubcategoryRepository.getAll();
  },
  getSubcategoriesByCategoryId: async (categoryId) => {
    if (!categoryId) {
      throw new Error("No se ha proporcionado el id de la categoría");
    }
    return await SubcategoryRepository.getByCategoryId(categoryId);
  },
  createSubcategory: async (name, categoryId) => {
    if (!categoryId) {
      throw new Error("No se ha proporcionado el id de la categoría");
    }
    if (!name || name.trim() === "") {
      throw new Error("El nombre del subcategoría es obligatorio");
    }
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return await SubcategoryRepository.create(name.trim(), slug, categoryId);
  },
};

module.exports = SubcategoryService;
