const ProductRepository = require("../repositories/productRepository.js");

const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const ProductService = {
  getAll: async () => {
    return await ProductRepository.getAll();
  },
  create: async (productData, files) => {
    if (!productData.name || !productData.price) {
      throw new Error("El nombre y el precio son obligatorios");
    }
    const slug = generateSlug(productData.name);

    const completeData = { ...productData, slug };

    const productId = await ProductRepository.create(completeData);

    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const imagePath = files[i].path;
        const isPrimary = i === 0 ? 1 : 0;
        await ProductRepository.addImage(productId, imagePath, isPrimary);
      }
    }
    return { id: productId, ...completeData };
  },
  update: async (id, productData, files) => {
    if (!productData.name || !productData.price) {
      throw new Error("El nombre y el precio son obligatorios");
    }
    const slug = generateSlug(productData.name);

    await ProductRepository.update(id, {
      ...productData,
      slug,
    });

    if (files && files.length > 0) {
      const currentProduct = await ProductRepository.getById(id);
      const hasPrimaryImage = currentProduct?.images?.some(
        (img) => img.is_primary === 1,
      );

      for (let i = 0; i < files.length; i++) {
        const imagePath = files[i].path;
        const isPrimary = !hasPrimaryImage && i === 0 ? 1 : 0;
        await ProductRepository.addImage(id, imagePath, isPrimary);
      }
    }

    return { id, ...productData, slug };
  },
};

module.exports = ProductService;
