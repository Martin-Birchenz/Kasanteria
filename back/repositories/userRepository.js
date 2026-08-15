const pool = require("../config/db.js");

const userRepository = {
  findByEmail: async (email) => {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows[0];
  },
  create: async ({ name, email, hashedPassword, role = "admin" }) => {
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role],
    );
    return result.insertId;
  },
};

module.exports = userRepository;
