const express = require("express");
const cors = require("cors");
require("dotenv").config();
const pool = require("./config/db.js");

const categoryRoutes = require("./routes/categoryRoutes.js");
const productRoutes = require("./routes/productRoutes.js");

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Servidor de Kasantería funcionando",
    timestamp: new Date(),
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
