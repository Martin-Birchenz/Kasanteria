const OrderRepository = require("../repositories/orderRepository.js");

const OrderController = {
  createOrder: async (req, res) => {
    try {
      const { customer, total_price, payment_method, items } = req.body;
      if (!items || items.length === 0) {
        return res
          .status(400)
          .json({ message: "No hay productos en el carrito" });
      }
      const orderId = await OrderRepository.create({
        customer_name: customer?.name || "Cliente web",
        customer_phone: customer?.phone || null,
        customer_address: customer?.address || null,
        customer_notes: customer?.notes || null,
        total_price: Number(total_price) || 0,
        payment_method: payment_method || "whatsapp",
        items: items,
      });
      res.status(201).json({ orderId });
    } catch (error) {
      res.status(500).json({ error: error.message });
      console.error(error);
    }
  },
  getOrders: async (req, res) => {
    try {
      const orders = await OrderRepository.getAll();
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getOrderDetail: async (req, res) => {
    try {
      const order = await OrderRepository.getById(req.params.id);
      if (!order) return res.status(404).json({ message: "Order not found" });
      return res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  updateOrderStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const success = await OrderRepository.updateStatus(req.params.id, status);
      if (!success) return res.status(404).json({ message: "Order not found" });
      return res.status(200).json({ message: "Order updated successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = OrderController;
