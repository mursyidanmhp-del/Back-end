const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.PGHOST || "localhost",
  port: Number(process.env.PGPORT) || 5432,
  user: process.env.PGUSER || "postgres",
  password: process.env.PGPASSWORD || "postgres",
  database: process.env.PGDATABASE || "latihan_postgres_migration",
});

async function checkConnection() {
  try {
    await pool.query("SELECT 1");
    return true;
  } catch (err) {
    const detail = err.message || err.code || (err.errors && err.errors[0] && err.errors[0].message) || String(err);
    console.log(`❌ Gagal konek ke PostgreSQL: ${detail}`);
    console.log("Pastikan:");
    console.log("1. PostgreSQL sudah terpasang dan sedang jalan");
    console.log(`2. Database "${pool.options.database}" sudah dibuat — jalankan: npm run buat-db`);
    console.log("3. Kredensial di file .env (host/user/password) sudah sesuai");
    return false;
  }
}

module.exports = { pool, checkConnection };
