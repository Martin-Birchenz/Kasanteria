const ProductRepository = require("../repositories/productRepository.js");

const ProductService = {
  // Obtener todos los productos
  getAll: async () => {
    return await ProductRepository.getAll();
  },
  // Crear un producto
  create: async (productData, files) => {
    if (!productData.name || !productData.price) {
      throw new Error("El nombre y el precio son obligatorios");
    }
    const slug = productData.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const completeData = { ...productData, slug };
    const productId = await ProductRepository.create(completeData);
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const imagePath = `/uploads/${files[i].filename}`;
        const isPrimary = i === 0 ? 1 : 0;
        await ProductRepository.addImage(productId, imagePath, isPrimary);
      }
    }
    return { id: productId, ...completeData };
  },
};

module.exports = ProductService;
