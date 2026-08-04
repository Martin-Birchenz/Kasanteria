const pool = require("../config/db.js");

const CategoryRepository = {
  // Función para obtener las categorías
  getAll: async () => {
    const [rows] = await pool.query(
      "SELECT idcategories, name, slug FROM categories WHERE is_active = 1",
    );
    return rows;
  },
  // Función para crear una categoría
  create: async (name, slug) => {
    const [result] = await pool.query(
      "INSERT INTO categories (name, slug) VALUES (?, ?)",
      [name, slug],
    );
    return { id: result.insertId, name, slug };
  },
};

module.exports = CategoryRepository;
