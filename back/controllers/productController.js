const ProductService = require("../services/productService.js");
const ProductRepository = require("../repositories/productRepository.js");

const ProductController = {
  getProduct: async (req, res) => {
    try {
      const products = await ProductService.getAll();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getProductById: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await ProductRepository.getById(id);
      if (!product)
        return res.status(404).json({ message: "Producto no encontrado" });
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getFeatured: async (req, res) => {
    try {
      const products = await ProductRepository.getFeatured();
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
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  },
  updateProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedProduct = await ProductService.update(
        id,
        req.body,
        req.files,
      );
      res.status(200).json(updatedProduct);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  toggleStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { is_active } = req.body;
      await ProductRepository.toggleStatus(id, is_active);
      res.status(200).json({ message: "Producto actualizado con éxito" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  toggleFeatured: async (req, res) => {
    try {
      const { id } = req.params;
      const { is_featured } = req.body;
      await ProductRepository.toggleFeatured(id, is_featured);
      res.status(200).json({ message: "Producto actualizado con éxito" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;
      await ProductRepository.deleteProduct(id);
      res.status(200).json({ message: "Producto eliminado con éxito" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = ProductController;
