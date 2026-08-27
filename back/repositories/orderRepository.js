const pool = require("../config/db.js");

const OrderRepository = {
  create: async ({ customer_name, customer_phone, total_price, items }) => {
    console.log("🛒 [OrderRepo] Iniciando creación de orden...");
    console.log("👤 [OrderRepo] Datos cliente:", {
      customer_name,
      customer_phone,
      total_price,
    });
    console.log("📦 [OrderRepo] Items:", items);
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const name = customer_name || "Cliente web";
      const phone = customer_phone || null;
      const total = Number(total_price) || 0;
      const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

      console.log("➡️ [OrderRepo] Ejecutando INSERT en orders...");
      const [orderResult] = await connection.query(
        "INSERT INTO orders (order_number, customer_name, customer_phone, total_amount, status) VALUES (?, ?, ?, ?, 'pendiente')",
        [orderNumber, name, phone, total],
      );
      const orderId = orderResult.insertId;
      console.log("✅ [OrderRepo] Orden insertada con ID:", orderId);
      for (const item of items) {
        const prodId = item.idproducts || item.id;
        const qty = Number(item.quantity) || 1;
        const price = Number(item.price) || 0;
        console.log(
          `➡️ [OrderRepo] Insertando item - Producto ID: ${prodId}, Cantidad: ${qty}, Precio: ${price}`,
        );
        await connection.query(
          "INSERT INTO order_items (oi_order_id, oi_product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)",
          [orderId, prodId, qty, price],
        );
        console.log(
          `➡️ [OrderRepo] Actualizando stock del producto ${prodId}...`,
        );
        await connection.query(
          "UPDATE products SET stock = GREATEST(0, stock - ?) WHERE idproducts = ?",
          [qty, prodId],
        );
      }
      await connection.commit();
      console.log("🎉 [OrderRepo] Transacción completada con éxito!");
      return orderId;
    } catch (error) {
      await connection.rollback();
      console.error("💥 [OrderRepo ERROR SQL DETALLADO]:", error);
      throw error;
    } finally {
      connection.release();
    }
  },
  getAll: async () => {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM orders ORDER BY created_at DESC",
      );
      console.log(`📋 [OrderRepo] Obtenidas ${rows.length} órdenes.`);
      return rows;
    } catch (error) {
      console.error("💥 [OrderRepo ERROR SQL DETALLADO]:", error);
      throw error;
    }
  },
  getById: async (orderId) => {
    const [orders] = await pool.query(
      "SELECT * FROM orders WHERE idorders = ? or id = ?",
      [orderId, orderId],
    );
    if (orders.length === 0) return null;
    const [items] = await pool.query(
      `SELECT oi.idorder_items, oi.quantity, oi.price_at_purchase, p.name, p.description, i.image_path 
         FROM order_items oi 
         JOIN products p ON oi.oi_product_id = p.idproducts 
         LEFT JOIN product_image i ON p.idproducts = i.product_id AND i.is_primary = 1 
         WHERE oi.oi_order_id = ?`,
      [orderId],
    );
    return { ...orders[0], items };
  },
  updateStatus: async (orderId, status) => {
    const [result] = await pool.query(
      "UPDATE orders SET status = ? WHERE idorders = ? OR id = ?",
      [status, orderId],
    );
    return result.affectedRows > 0;
  },
};

module.exports = OrderRepository;
