const pool = require("../config/db.js");

const ProductRepository = {
  getAll: async () => {
    const [rows] = await pool.query(
      "SELECT p.*, i.image_path FROM products p LEFT JOIN product_image i ON p.idproducts = i.product_id AND i.is_primary = 1 WHERE p.is_active = 1",
    );
    return rows;
  },
  getById: async (id) => {
    const [row] = await pool.query(
      "SELECT * FROM products WHERE idproducts = ? AND is_active = 1",
      [id],
    );
    if (row.length === 0) return null;

    const [image] = await pool.query(
      "SELECT idproduct_image, image_path, is_primary FROM product_image WHERE product_id = ?",
      [id],
    );
    return { ...row[0], images: image };
  },
  getFeatured: async () => {
    const [rows] = await pool.query(
      "SELECT p.*, i.image_path FROM products p LEFT JOIN product_image i ON p.idproducts = i.product_id AND i.is_primary = 1 WHERE p.is_active = 1 AND p.is_featured = 1 LIMIT 6",
    );
    return rows;
  },
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

    const subCatId = Number(subcategory_id) || null;
    const numPrice = Number(price) || 0;
    const numStock = Number(stock) || 0;
    const featured = Number(is_featured) || 0;
    const desc = description || "";

    const [result] = await pool.query(
      "INSERT INTO products (subcategory_id, name, slug, description, price, stock, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [subCatId, name, slug, desc, numPrice, numStock, featured],
    );
    return result.insertId;
  },
  addImage: async (productId, imagePath, isPrimary) => {
    const [result] = await pool.query(
      "INSERT INTO product_image (product_id, image_path, is_primary) VALUES (?, ?, ?)",
      [productId, imagePath, isPrimary],
    );
  },
  toggleStatus: async (id, isActive) => {
    const [result] = await pool.query(
      "UPDATE products SET is_active = ? WHERE idproducts = ?",
      [isActive, id],
    );
    return result.affectedRows;
  },
  deleteProduct: async (id) => {
    await pool.query("DELETE FROM product_image WHERE product_id = ?", [id]);
    const [result] = await pool.query(
      "DELETE FROM products WHERE idproducts = ?",
      [id],
    );
    return result.affectedRows;
  },
};

module.exports = ProductRepository;
