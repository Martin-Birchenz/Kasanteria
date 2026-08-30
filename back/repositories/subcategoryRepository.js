const pool = require("../config/db.js");

const SubcategoryRepository = {
  getAll: async () => {
    const [rows] = await pool.query(
      `SELECT s.idsubcategories, s.category_id, s.name, s.slug, s.is_active, COALESCE(c.name, 'Sin Categoría') AS category_name 
       FROM subcategories s 
       LEFT JOIN categories c ON s.category_id = c.idcategories 
       WHERE s.is_active = 1
       ORDER BY c.name ASC, s.name ASC`,
    );
    return rows;
  },
  getByCategoryId: async (categoryId) => {
    const [rows] = await pool.query(
      `SELECT idsubcategories, category_id, name, slug 
       FROM subcategories 
       WHERE category_id = ? AND is_active = 1 
       ORDER BY name ASC`,
      [categoryId],
    );
    return rows;
  },
  create: async (name, slug, categoryId) => {
    const [result] = await pool.query(
      "INSERT INTO subcategories (category_id, name, slug, is_active) VALUES (?, ?, ?, 1)",
      [categoryId, name, slug],
    );
    return { id: result.insertId, category_id: categoryId, name, slug };
  },
};

module.exports = SubcategoryRepository;
