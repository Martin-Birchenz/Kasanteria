const pool = require("../config/db.js");

const CategoryRepository = {
  getAll: async () => {
    const [rows] = await pool.query(
      "SELECT idcategories, name, slug, is_active FROM categories WHERE is_active = 1 ORDER BY name ASC",
    );
    return rows;
  },
  getAllAdmin: async () => {
    const [rows] = await pool.query(
      "SELECT idcategories, name, slug, is_active FROM categories ORDER BY idcategories DESC",
    );
    return rows;
  },
  create: async (name, slug) => {
    const [result] = await pool.query(
      "INSERT INTO categories (name, slug, is_active) VALUES (?, ?, 1)",
      [name, slug],
    );
    return { idcategories: result.insertId, name, slug, is_active: 1 };
  },
  delete: async (id) => {
    const [result] = await pool.query(
      "UPDATE categories SET is_active = 0 WHERE idcategories = ?",
      [id],
    );
    return result.affectedRows > 0;
  },
};

module.exports = CategoryRepository;
