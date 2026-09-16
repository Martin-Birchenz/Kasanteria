const { MercadoPagoConfig, Preference } = require("mercadopago");

const token = process.env.MP_ACCESS_TOKEN;

const client = new MercadoPagoConfig({
  access_token: token || "",
  options: { timeout: 5000 },
});

const preferenceClient = new Preference(client);

module.exports = { preferenceClient };
