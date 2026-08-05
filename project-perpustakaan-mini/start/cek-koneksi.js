/**
 * Script diagnostik — cek server nyala, database ada, dan bisa
 * di-query, tahap demi tahap.
 *
 * Cara pakai: npm run cek-koneksi
 */
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const { Client } = require("pg");

const config = {
  host: process.env.PGHOST || "localhost",
  port: Number(process.env.PGPORT) || 5432,
  user: process.env.PGUSER || "postgres",
  password: process.env.PGPASSWORD || "postgres",
};
const targetDb = process.env.PGDATABASE || "perpustakaan_mini";

function detailOf(err) {
  return err.message || err.code || (err.errors && err.errors[0] && err.errors[0].message) || String(err);
}

console.log("================================");
console.log("Cek Koneksi PostgreSQL");
console.log("================================");
console.log(`host=${config.host} port=${config.port} user=${config.user} database_tujuan=${targetDb}`);
console.log("");

async function main() {
  console.log("[1/3] Cek server nyala & login berhasil...");
  const serverClient = new Client({ ...config, database: "postgres" });

  try {
    await serverClient.connect();
  } catch (err) {
    console.log(`❌ GAGAL: ${detailOf(err)}`);
    process.exit(1);
  }
  console.log("✅ Server nyala, login berhasil.");
  console.log("");

  console.log(`[2/3] Cek database "${targetDb}" ada...`);
  const { rows } = await serverClient.query("SELECT datname FROM pg_database WHERE datistemplate = false ORDER BY datname");
  const daftarDb = rows.map((r) => r.datname);
  const ada = daftarDb.includes(targetDb);

  console.log(`Database yang ada di server ini: ${daftarDb.join(", ")}`);
  if (!ada) {
    console.log(`❌ Database "${targetDb}" BELUM ADA. Cara bikin: npm run buat-db`);
    await serverClient.end();
    process.exit(1);
  }
  console.log(`✅ Database "${targetDb}" ada.`);
  console.log("");
  await serverClient.end();

  console.log(`[3/3] Cek bisa connect & query langsung ke "${targetDb}"...`);
  const targetClient = new Client({ ...config, database: targetDb });
  try {
    await targetClient.connect();
    await targetClient.query("SELECT 1");
    await targetClient.end();
  } catch (err) {
    console.log(`❌ GAGAL: ${detailOf(err)}`);
    process.exit(1);
  }
  console.log(`✅ Konek & query ke "${targetDb}" berhasil.`);
  console.log("");
  console.log("================================");
  console.log("✅ SEMUA BERES — siap ngerjain project");
  console.log("================================");
}

main().catch((err) => {
  console.log(`❌ Error gak terduga: ${detailOf(err)}`);
  process.exit(1);
});
