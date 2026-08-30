const SubcategoryService = require("../services/subcategoryService.js");

const SubcategoryController = {
  getSubcategories: async (req, res) => {
    try {
      const categoryId = req.query.categoryId || req.query.category_id;
      let data;
      if (categoryId) {
        data =
          await SubcategoryService.getSubcategoriesByCategoryId(categoryId);
      } else {
        data = await SubcategoryService.getAllSubcategories();
      }
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  createSubcategory: async (req, res) => {
    try {
      const categoryId = req.body.categoryId || req.body.category_id;
      const { name } = req.body;
      const newSubcategory = await SubcategoryService.createSubcategory(
        name,
        categoryId,
      );
      res.status(201).json({
        message: "Subcategoría creada con éxito",
        data: newSubcategory,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = SubcategoryController;
