const fs = require("fs");
const path = require("path");
const { pool, checkConnection } = require("./db");
const { stripComments } = require("./strip-comments");
const { createBaselineBuku } = require("./fixture");

const fileName = "04-query-berparameter.js";
const filePath = path.join(__dirname, "..", "soal", fileName);

const requiredWords = [
  'require("./01-db")', "async function tambahBuku", "$1", "$2", "RETURNING *", "module.exports",
];
const forbiddenWords = ["`", "+ judul", "judul +", "+ penulis", "penulis +"];

console.log("================================");
console.log("Menjalankan test query-berparameter.js");
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
    console.log(`❌ query-berparameter.js wajib menggunakan "${word}"`);
    isValid = false;
  } else {
    console.log(`✅ menggunakan "${word}"`);
  }
});

forbiddenWords.forEach((word) => {
  if (codeOnly.includes(word)) {
    console.log(`❌ query-berparameter.js tidak boleh menggunakan "${word}" (bahaya SQL Injection)`);
    isValid = false;
  }
});

async function main() {
  require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
  process.env.PGHOST = process.env.PGHOST || "localhost";
  process.env.PGPORT = process.env.PGPORT || "5432";
  process.env.PGUSER = process.env.PGUSER || "postgres";
  process.env.PGPASSWORD = process.env.PGPASSWORD || "postgres";
  process.env.PGDATABASE = process.env.PGDATABASE || "latihan_postgres_migration";

  if (!(await checkConnection())) {
    process.exit(1);
  }

  try {
    await createBaselineBuku(pool);
  } catch (err) {
    console.log(`❌ Gagal menyiapkan data tes: ${err.message}`);
    await pool.end();
    process.exit(1);
  }

  let tambahBuku;
  try {
    tambahBuku = require(filePath);
  } catch (err) {
    console.log(`❌ query-berparameter.js error saat di-require: ${err.message}`);
    await pool.end();
    process.exit(1);
  }

  if (typeof tambahBuku !== "function") {
    console.log("❌ query-berparameter.js harus module.exports sebuah function (tambahBuku)");
    await pool.end();
    process.exit(1);
  }

  try {
    const hasil = await tambahBuku("Laskar Pelangi", "Andrea Hirata");

    if (!hasil || hasil.judul !== "Laskar Pelangi" || hasil.penulis !== "Andrea Hirata" || !hasil.id) {
      console.log(`❌ Return value belum sesuai (harus baris yang baru diinsert, lengkap sama id), dapat: ${JSON.stringify(hasil)}`);
      isValid = false;
    } else {
      console.log("✅ Return value sesuai (baris baru, lengkap sama id)");
    }

    const cekDb = await pool.query("SELECT judul, penulis FROM buku WHERE judul = $1", ["Laskar Pelangi"]);
    if (cekDb.rows.length !== 1 || cekDb.rows[0].penulis !== "Andrea Hirata") {
      console.log("❌ Data belum beneran tersimpan di database dengan benar");
      isValid = false;
    } else {
      console.log("✅ Data beneran tersimpan di database");
    }

    // pastiin placeholder-nya beneran dipakai (bukan pura-pura) —
    // input yang isinya kutip tunggal HARUS tetep aman, gak error
    const hasilAneh = await tambahBuku("Judul Aneh's", "Penulis O'Brien");
    if (!hasilAneh || hasilAneh.judul !== "Judul Aneh's") {
      console.log("❌ Query gagal/salah waktu judul mengandung tanda kutip — indikasi placeholder $1/$2 gak beneran dipakai");
      isValid = false;
    } else {
      console.log("✅ Aman waktu data mengandung tanda kutip (placeholder beneran dipakai)");
    }
  } catch (err) {
    console.log(`❌ query-berparameter.js error saat dipanggil: ${err.message}`);
    isValid = false;
  }

  // soal 4 (lewat require("./01-db")) buka Pool-nya sendiri — tutup
  // juga biar proses node ini bisa exit, gak nge-hang nunggu idle pool
  try {
    const dbSoal1Path = path.join(__dirname, "..", "soal", "01-db.js");
    if (require.cache[require.resolve(dbSoal1Path)]) {
      const studentPool = require(dbSoal1Path);
      await studentPool.end().catch(() => {});
    }
  } catch (_) {
    // soal 1 mungkin belum valid/gak bisa di-require — abaikan, udah kecatet di atas
  }

  await pool.end();

  if (isValid) {
    console.log("✅ query-berparameter.js LULUS");
    process.exit(0);
  } else {
    console.log("❌ query-berparameter.js BELUM LULUS");
    process.exit(1);
  }
}

main();
