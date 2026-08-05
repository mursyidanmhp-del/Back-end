require("dotenv").config();

const pool = require("./config/database");
const { runMigrations } = require("./db/migrate");
const seed = require("./db/seeders/seed");

async function main() {
  console.log("1. Jalankan migration...");
  await runMigrations(pool, __dirname + "/db/migrations");
  console.log("✅ Migration beres — tabel buku siap.\n");

  console.log("2. Jalankan seed...");
  await seed();
  console.log("✅ Seed beres — rak udah keisi.\n");

  console.log("3. Lihat isi tabel buku:");
  const hasil = await pool.query("SELECT * FROM buku");
  console.table(hasil.rows);

  await pool.end();
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
