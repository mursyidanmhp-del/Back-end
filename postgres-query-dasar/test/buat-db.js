/**
 * Script setup — BUKAN bagian dari test yang dinilai.
 * Connect ke PostgreSQL pakai user "postgres" (password = "postgres",
 * sama kayak default .env.example) dan bikin database latihan kalau
 * belum ada. Aman dijalankan berkali-kali (gak error kalau db-nya
 * udah ada).
 *
 * Cara pakai:
 *   node test/buat-db.js
 */
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const { Client } = require("pg");

const config = {
  host: process.env.PGHOST || "localhost",
  port: Number(process.env.PGPORT) || 5432,
  user: process.env.PGUSER || "postgres",
  // requirement: password sama dengan username ("postgres")
  password: process.env.PGPASSWORD || "postgres",
};
const targetDb = process.env.PGDATABASE || "latihan_postgres_dasar";

function detailOf(err) {
  return err.message || err.code || (err.errors && err.errors[0] && err.errors[0].message) || String(err);
}

console.log("================================");
console.log("Setup Database — PostgreSQL Query Dasar");
console.log("================================");
console.log(`host=${config.host} port=${config.port} user=${config.user} database=${targetDb}`);
console.log("");

async function main() {
  console.log("[1/2] Connect ke server (database bawaan \"postgres\")...");
  const client = new Client({ ...config, database: "postgres" });

  try {
    await client.connect();
  } catch (err) {
    console.log(`❌ GAGAL connect: ${detailOf(err)}`);
    console.log("");
    if (err.code === "ECONNREFUSED") {
      console.log("Artinya: server PostgreSQL-nya BELUM NYALA (atau host/port salah).");
      console.log("- Windows: cek Services → \"postgresql-x64-16\" harus status Running.");
      console.log("- Mac: jalankan `brew services start postgresql@16`.");
    } else if (err.code === "28P01") {
      console.log(`Artinya: SALAH PASSWORD buat user "${config.user}".`);
      console.log("- Sesuai requirement, password harus SAMA dengan username, jadi:");
      console.log(`  user="${config.user}" password="${config.user}"`);
      console.log("- Kalau pas instalasi kamu ketik password beda, pakai password itu");
      console.log("  (isi PGPASSWORD di .env sesuai password aslinya).");
    } else if (err.code === "28000" || /role .* does not exist/i.test(err.message || "")) {
      console.log(`Artinya: user "${config.user}" GAK ADA di PostgreSQL kamu.`);
    } else {
      console.log("Cek lagi host/port/user/password di file .env.");
    }
    process.exit(1);
  }
  console.log("✅ Connect berhasil.");
  console.log("");

  console.log(`[2/2] Cek & bikin database "${targetDb}"...`);
  const { rows } = await client.query("SELECT 1 FROM pg_database WHERE datname = $1", [targetDb]);

  if (rows.length > 0) {
    console.log(`✅ Database "${targetDb}" sudah ada — gak perlu dibikin ulang.`);
  } else {
    try {
      // CREATE DATABASE gak boleh pakai parameter binding / dijalanin
      // di dalam transaction, jadi nama db divalidasi manual dulu.
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(targetDb)) {
        throw new Error(`Nama database "${targetDb}" gak valid (cuma boleh huruf, angka, underscore).`);
      }
      await client.query(`CREATE DATABASE ${targetDb}`);
      console.log(`✅ Database "${targetDb}" berhasil dibikin.`);
    } catch (err) {
      console.log(`❌ GAGAL bikin database: ${detailOf(err)}`);
      await client.end();
      process.exit(1);
    }
  }

  await client.end();

  console.log("");
  console.log("================================");
  console.log("✅ SIAP — lanjut: npm install, lalu npm run cek-koneksi");
  console.log("================================");
}

main().catch((err) => {
  console.log(`❌ Error gak terduga: ${detailOf(err)}`);
  process.exit(1);
});
