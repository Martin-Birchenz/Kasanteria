const pool = require("../config/db.js");

const ShippingRepository = {
  calculateRate: async (postalCode) => {
    const cp = Number(postalCode);
    const [rows] = await pool.query(
      `SELECT name, cost, estimated_days 
       FROM shipping_rates 
       WHERE ? BETWEEN min_cp AND max_cp AND is_active = 1 
       LIMIT 1`,
      [cp],
    );
    return rows[0] || null;
  },
};

module.exports = ShippingRepository;
