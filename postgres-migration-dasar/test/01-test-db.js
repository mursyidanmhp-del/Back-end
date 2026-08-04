const fs = require("fs");
const path = require("path");
const { stripComments } = require("./strip-comments");

const fileName = "01-db.js";
const filePath = path.join(__dirname, "..", "soal", fileName);

const requiredWords = [
  'require("pg")', "new Pool", "process.env.PGHOST", "process.env.PGUSER",
  "process.env.PGPASSWORD", "process.env.PGDATABASE", "module.exports",
];
const forbiddenWords = ["new Client"];

console.log("================================");
console.log("Menjalankan test db.js (soal 1)");
console.log("================================");

if (!fs.existsSync(filePath)) {
  console.log(`❌ File ${fileName} tidak ditemukan`);
  process.exit(1);
}

const code = fs.readFileSync(filePath, "utf8");
const codeOnly = stripComments(code);

let isValid = true;

requiredWords.forEach((word) => {
  if (!codeOnly.includes(word)) {
    console.log(`❌ db.js wajib menggunakan "${word}"`);
    isValid = false;
  } else {
    console.log(`✅ menggunakan "${word}"`);
  }
});

forbiddenWords.forEach((word) => {
  if (codeOnly.includes(word)) {
    console.log(`❌ db.js tidak boleh menggunakan "${word}"`);
    isValid = false;
  }
});

async function main() {
  // pastiin process.env keisi dari .env sebelum soal 1 di-require
  // (soal 1 baca process.env langsung waktu file-nya dieksekusi)
  require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
  process.env.PGHOST = process.env.PGHOST || "localhost";
  process.env.PGPORT = process.env.PGPORT || "5432";
  process.env.PGUSER = process.env.PGUSER || "postgres";
  process.env.PGPASSWORD = process.env.PGPASSWORD || "postgres";
  process.env.PGDATABASE = process.env.PGDATABASE || "latihan_postgres_migration";

  let pool;
  try {
    pool = require(filePath);
  } catch (err) {
    console.log(`❌ db.js error saat di-require: ${err.message}`);
    process.exit(1);
  }

  if (!pool || typeof pool.query !== "function") {
    console.log("❌ db.js harus module.exports sebuah Pool (punya method .query)");
    process.exit(1);
  }

  if (typeof pool.totalCount !== "number") {
    console.log('❌ Yang di-export kelihatannya bukan Pool (gak ada properti khas Pool seperti totalCount) — pastikan pakai "new Pool", bukan "new Client"');
    isValid = false;
  } else {
    console.log("✅ Yang di-export adalah Pool");
  }

  try {
    const res = await pool.query("SELECT 1 AS ok");
    if (res.rows[0].ok !== 1) {
      console.log("❌ Query SELECT 1 gak ngasih hasil yang bener");
      isValid = false;
    } else {
      console.log("✅ pool.query(\"SELECT 1\") berhasil — koneksi ke database beneran jalan");
    }
  } catch (err) {
    console.log(`❌ db.js error saat query: ${err.message}`);
    isValid = false;
  } finally {
    await pool.end().catch(() => {});
  }

  if (isValid) {
    console.log("✅ db.js LULUS");
    process.exit(0);
  } else {
    console.log("❌ db.js BELUM LULUS");
    process.exit(1);
  }
}

main();
