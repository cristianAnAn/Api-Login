require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Si tu base de datos requiere SSL, descomenta las siguientes líneas:
  // ssl: {
  //   rejectUnauthorized: false
  // }
});

pool.connect()
  .then(() => console.log("✅ Conectado a PostgreSQL"))
  .catch(err => console.error("❌ Error conectando a PostgreSQL:", err));

module.exports = pool;
