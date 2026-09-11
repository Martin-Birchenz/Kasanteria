const pool = require("./config/db.js");

async function testConnection() {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS test, NOW() AS fecha;");
    console.log("Conexión exitosa a Aiven:", rows);
    process.exit(0);
  } catch (error) {
    console.error("Error al conectar a Aiven:", error.message);
    process.exit(1);
  }
}

testConnection();
