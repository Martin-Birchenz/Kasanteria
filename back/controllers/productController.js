const ProductService = require("../services/productService.js");

const ProductController = {
  getProduct: async (req, res) => {
    try {
      const products = await ProductService.getAll();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  createProduct: async (req, res) => {
    try {
      const productData = req.body;
      const files = req.files;
      const newProduct = await ProductService.create(productData, files);
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = ProductController;
