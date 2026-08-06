const pool = require("../config/db.js");

const ProductRepository = {
  // Función para obtener todos los productos
  getAll: async () => {
    const [rows] = await pool.query(
      "SELECT p.*, i.image_path FROM products p LEFT JOIN product_image i ON p.id = i.product_id AND i.is_primary = 1 WHERE p.is_active = 1",
    );
    return rows;
  },
  // Crear producto
  create: async (productData) => {
    const {
      subcategory_id,
      name,
      slug,
      description,
      price,
      stock,
      is_featured,
    } = productData;
    const [result] = await pool.query(
      "INSERT INTO products (subcategory_id, name, slug, description, price, stock, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [subcategory_id, name, slug, description, price, stock, is_featured],
    );
    return result.insertId;
  },
  addImage: async (productId, imagePath, isPrimary) => {
    const [result] = await pool.query(
      "INSERT INTO product_image (product_id, image_path, is_primary) VALUES (?, ?, ?)",
      [productId, imagePath, isPrimary],
    );
  },
};

module.exports = ProductRepository;
