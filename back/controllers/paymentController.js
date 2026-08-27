// controllers/paymentController.js
const { preferenceClient } = require("../config/mp.js");

const paymentController = {
  createPreference: async (req, res) => {
    try {
      const { items, customer } = req.body || {};

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res
          .status(400)
          .json({ message: "No hay productos válidos para procesar." });
      }

      // Mapeo seguro asegurando que cada producto tenga valores por defecto
      const mpItems = items.map((item) => {
        const title = item.name || item.title || "Producto";
        const price = Number(item.price || item.unit_price) || 0;
        const quantity = Number(item.quantity) || 1;

        return {
          id: String(item.idproducts || item.id || Math.random()),
          title: String(title),
          description: String(item.description || title),
          picture_url: item.image_path
            ? `http://localhost:3000${item.image_path}`
            : undefined,
          quantity: quantity,
          unit_price: price,
          currency_id: "ARS",
        };
      });

      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

      // Datos seguros del comprador con valores por defecto
      const payerName = customer && customer.name ? customer.name : "Comprador";
      const payerEmail =
        customer && customer.email
          ? customer.email
          : "comprador@kasanteria.com";
      const payerPhone =
        customer && customer.phone ? String(customer.phone) : "";

      const response = await preferenceClient.create({
        body: {
          items: mpItems,
          payer: {
            name: payerName,
            email: payerEmail,
            phone: {
              number: payerPhone,
            },
          },
          back_urls: {
            success: `${frontendUrl}/checkout/success`,
            failure: `${frontendUrl}/checkout/failure`,
            pending: `${frontendUrl}/checkout/pending`,
          },
          auto_return: "approved",
          statement_descriptor: "KASANTERIA",
        },
      });

      return res.status(200).json({
        id: response.id,
        init_point: response.init_point,
        sandbox_init_point: response.sandbox_init_point,
      });
    } catch (error) {
      console.error("Error al crear preferencia en Mercado Pago:", error);
      return res.status(500).json({
        message: "Error al generar la preferencia de pago",
        error: error.message,
      });
    }
  },
};

module.exports = paymentController;
