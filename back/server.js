const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const pool = require("./config/db.js");

const categoryRoutes = require("./routes/categoryRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const authRoutes = require("./routes/authRoutes.js");
const paymentRoutes = require("./routes/paymentRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");
const subcategoryRoutes = require("./routes/subcategoryRoutes.js");
const shippingRoutes = require("./routes/shippingRoutes.js");

const app = express();
const PORT = process.env.PORT;

const allowedOrigins = [
  "http://localhost:5173",
  "https://punto-y-trama.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      return callback(new Error("Bloqueado por política CORS"));
    },
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);
app.use("/auth", authRoutes);
app.use("/payments", paymentRoutes);
app.use("/orders", orderRoutes);
app.use("/subcategories", subcategoryRoutes);
app.use("/shipping", shippingRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
