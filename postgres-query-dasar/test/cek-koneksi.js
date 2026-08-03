/**
 * Script diagnostik — BUKAN bagian dari test yang dinilai.
 * Jalankan buat mastiin PostgreSQL beneran nyala & database-nya ada,
 * sebelum lanjut ngerjain soal/.
 *
 * Cara pakai:
 *   node test/cek-koneksi.js
 */
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const { Client } = require("pg");

const config = {
  host: process.env.PGHOST || "localhost",
  port: Number(process.env.PGPORT) || 5432,
  user: process.env.PGUSER || "postgres",
  password: process.env.PGPASSWORD || "postgres",
};
const targetDb = process.env.PGDATABASE || "latihan_postgres_dasar";

function detailOf(err) {
  return err.message || err.code || (err.errors && err.errors[0] && err.errors[0].message) || String(err);
}

console.log("================================");
console.log("Cek Koneksi PostgreSQL");
console.log("================================");
console.log(`host=${config.host} port=${config.port} user=${config.user} database_tujuan=${targetDb}`);
console.log("");

async function main() {
  // TAHAP 1 — server-nya nyala & bisa login? (connect ke database bawaan "postgres")
  console.log("[1/3] Cek server nyala & login berhasil...");
  const serverClient = new Client({ ...config, database: "postgres" });

  try {
    await serverClient.connect();
  } catch (err) {
    console.log(`❌ GAGAL: ${detailOf(err)}`);
    console.log("");
    if (err.code === "ECONNREFUSED") {
      console.log("Artinya: server PostgreSQL-nya BELUM NYALA (atau host/port di .env salah).");
      console.log("- Windows: cek Services → \"postgresql-x64-16\" harus status Running.");
      console.log("- Mac: jalankan `brew services start postgresql@16`.");
    } else if (err.code === "28P01") {
      console.log('Artinya: SALAH PASSWORD buat user di atas.');
      console.log("- Cek ulang PGPASSWORD di .env, samain sama password pas instalasi.");
    } else if (err.code === "28000" || /role .* does not exist/i.test(err.message || "")) {
      console.log(`Artinya: user "${config.user}" GAK ADA di PostgreSQL kamu.`);
      console.log("- Cek ulang PGUSER di .env (default instalasi biasanya \"postgres\").");
    } else {
      console.log("Cek lagi host/port/user/password di file .env.");
    }
    process.exit(1);
  }
  console.log("✅ Server nyala, login berhasil.");
  console.log("");

  // TAHAP 2 — database tujuan ada di daftar database?
  console.log(`[2/3] Cek database "${targetDb}" ada...`);
  const { rows } = await serverClient.query("SELECT datname FROM pg_database WHERE datistemplate = false ORDER BY datname");
  const daftarDb = rows.map((r) => r.datname);
  const ada = daftarDb.includes(targetDb);

  console.log(`Database yang ada di server ini: ${daftarDb.join(", ")}`);
  if (!ada) {
    console.log(`❌ Database "${targetDb}" BELUM ADA.`);
    console.log("");
    console.log("Cara bikin:");
    console.log(`  createdb -U ${config.user} ${targetDb}`);
    console.log("atau lewat psql:");
    console.log(`  psql -U ${config.user}`);
    console.log(`  CREATE DATABASE ${targetDb};`);
    await serverClient.end();
    process.exit(1);
  }
  console.log(`✅ Database "${targetDb}" ada.`);
  console.log("");
  await serverClient.end();

  // TAHAP 3 — beneran bisa connect & query ke database tujuan
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
  console.log("✅ SEMUA BERES — siap ngerjain soal/ dan npm test");
  console.log("================================");
}

main().catch((err) => {
  console.log(`❌ Error gak terduga: ${detailOf(err)}`);
  process.exit(1);
});
