const { MercadoPagoConfig, Preference, Payment } = require("mercadopago");
const OrderRepository = require("../repositories/orderRepository.js");

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || "",
});

const PaymentController = {
  createPaymentPreference: async (req, res) => {
    try {
      const { customer, items, shippingCost } = req.body;

      if (!items || items.length === 0) {
        return res.status(400).json({ error: "No hay productos en el pedido" });
      }

      const shipping = Number(shippingCost) || 0;
      const subtotal = items.reduce(
        (acc, item) => acc + Number(item.price) * Number(item.quantity),
        0,
      );
      const totalAmount = subtotal + shipping;

      const orderId = await OrderRepository.create({
        customer_name: customer?.name || "Cliente web",
        customer_phone: customer?.phone || null,
        customer_address: customer?.address || null,
        customer_notes: customer?.notes || null,
        total_price: totalAmount,
        items,
        payment_method: "mercadopago",
      });

      const preferenceItems = items.map((prod) => ({
        id: String(prod.idproducts || prod.id),
        title: `${prod.name}${prod.selectedColor && prod.selectedColor !== "Único" ? ` (${prod.selectedColor})` : ""}`,
        quantity: Number(prod.quantity) || 1,
        unit_price: Number(prod.price),
        currency_id: "ARS",
      }));

      if (shippingCost > 0) {
        preferenceItems.push({
          id: "shipping-fee",
          title: "Costo de Envío",
          quantity: 1,
          unit_price: shipping,
          currency_id: "ARS",
        });
      }

      const preference = new Preference(client);

      const response = await preference.create({
        body: {
          items: preferenceItems,
          payer: {
            email: customer?.email || "cliente@ejemplo.com",
            name: customer?.name || "Cliente web",
          },
          external_reference: String(orderId),
          back_urls: {
            success: "http://localhost:5173/pago/exitoso",
            failure: "http://localhost:5173/pago/fallido",
            pending: "http://localhost:5173/pago/pendiente",
          },
          // auto_return: "approved",
          // notification_url: `${process.env.BACKEND_URL || "https://tu-dominio-ngrok.app"}/payments/webhook`,
        },
      });

      return res.status(200).json({ init_point: response.init_point, orderId });
    } catch (error) {
      console.error("💥 [MercadoPago Error]:", error);
      return res.status(500).json({ error: error.message });
    }
  },
  handleWebhook: async (req, res) => {
    try {
      const { query } = req;
      const topic = query.topic || query.type;

      if (topic === "payment") {
        const paymentId = query.id || query["data.id"];
        if (paymentId) {
          const paymentInstance = new Payment(client);
          const paymentData = await paymentInstance.get({ id: paymentId });

          if (paymentData.status === "approved") {
            const orderId = paymentData.external_reference;
            if (orderId) {
              await OrderRepository.confirmPayment(orderId, paymentId);
            }
          }
        }
      }

      return res.status(200).send("OK");
    } catch (error) {
      console.error("💥 [MercadoPago Webhook Error]:", error);
      return res.status(500).send("Error");
    }
  },
};

module.exports = PaymentController;
