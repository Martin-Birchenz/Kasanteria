const { MercadoPagoConfig, Preference } = require("mercadopago");

const token = process.env.MP_ACCESS_TOKEN;

if (!token) {
  console.error(
    "❌ ERROR: MP_ACCESS_TOKEN no está definido en el archivo .env",
  );
} else {
  console.log(
    "✅ MP_ACCESS_TOKEN cargado correctamente (inicia con:",
    token.substring(0, 10),
    "...)",
  );
}

const client = new MercadoPagoConfig({
  access_token: token || "",
  options: { timeout: 5000 },
});

const preferenceClient = new Preference(client);

module.exports = { preferenceClient };
