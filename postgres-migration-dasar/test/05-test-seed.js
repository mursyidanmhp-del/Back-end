const fs = require("fs");
const path = require("path");
const { pool, checkConnection } = require("./db");
const { stripComments } = require("./strip-comments");
const { createBaselineBuku } = require("./fixture");

const fileName = "05-seed.js";
const filePath = path.join(__dirname, "..", "soal", fileName);

const requiredWords = [
  'require("./01-db")', "async function seed", "DELETE FROM buku", "for", "$1", "module.exports",
];
const forbiddenWords = ["`"];

console.log("================================");
console.log("Menjalankan test seed.js");
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
    console.log(`❌ seed.js wajib menggunakan "${word}"`);
    isValid = false;
  } else {
    console.log(`✅ menggunakan "${word}"`);
  }
});

forbiddenWords.forEach((word) => {
  if (codeOnly.includes(word)) {
    console.log(`❌ seed.js tidak boleh menggunakan "${word}" (bahaya SQL Injection)`);
    isValid = false;
  }
});

// dilarang 3x INSERT manual terpisah — harus loop
const jumlahInsert = (codeOnly.match(/INSERT INTO/gi) || []).length;
if (jumlahInsert > 1) {
  console.log(`❌ seed.js kedapatan ${jumlahInsert}x "INSERT INTO" terpisah — harusnya SATU INSERT di dalam loop, bukan ditulis manual berulang`);
  isValid = false;
} else if (jumlahInsert === 1) {
  console.log('✅ cuma ada 1 "INSERT INTO" (tandanya beneran pakai loop, bukan ditulis manual 3x)');
}

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

  let seed;
  try {
    seed = require(filePath);
  } catch (err) {
    console.log(`❌ seed.js error saat di-require: ${err.message}`);
    await pool.end();
    process.exit(1);
  }

  if (typeof seed !== "function") {
    console.log("❌ seed.js harus module.exports sebuah function (seed)");
    await pool.end();
    process.exit(1);
  }

  const expected = [
    { judul: "Laskar Pelangi", penulis: "Andrea Hirata" },
    { judul: "Bumi Manusia", penulis: "Pramoedya Ananta Toer" },
    { judul: "Negeri 5 Menara", penulis: "Ahmad Fuadi" },
  ];

  try {
    await seed();

    const hasil1 = await pool.query("SELECT judul, penulis FROM buku ORDER BY id");
    if (hasil1.rows.length !== 3) {
      console.log(`❌ Setelah seed() sekali, jumlah baris harusnya 3, dapat ${hasil1.rows.length}`);
      isValid = false;
    } else {
      const cocok = expected.every((exp, i) => hasil1.rows[i].judul === exp.judul && hasil1.rows[i].penulis === exp.penulis);
      if (!cocok) {
        console.log(`❌ Data belum sesuai, dapat: ${JSON.stringify(hasil1.rows)}`);
        isValid = false;
      } else {
        console.log("✅ 3 buku contoh berhasil ke-insert dengan benar");
      }
    }

    // jalanin LAGI — ini yang mastiin DELETE dulu beneran dipakai
    // (kalau lupa DELETE, data bakal numpuk jadi 6 baris)
    await seed();
    const hasil2 = await pool.query("SELECT judul, penulis FROM buku ORDER BY id");
    if (hasil2.rows.length !== 3) {
      console.log(`❌ Setelah seed() dijalanin 2x, jumlah baris harusnya TETEP 3 (bukan numpuk), dapat ${hasil2.rows.length} — pastikan DELETE FROM buku dijalanin duluan`);
      isValid = false;
    } else {
      console.log("✅ seed() dijalanin 2x, data TETEP 3 baris (gak numpuk dobel)");
    }
  } catch (err) {
    console.log(`❌ seed.js error saat dipanggil: ${err.message}`);
    isValid = false;
  }

  try {
    const dbSoal1Path = path.join(__dirname, "..", "soal", "01-db.js");
    if (require.cache[require.resolve(dbSoal1Path)]) {
      const studentPool = require(dbSoal1Path);
      await studentPool.end().catch(() => {});
    }
  } catch (_) {
    // soal 1 mungkin belum valid/gak bisa di-require — abaikan, udah kecatet di test 01
  }

  await pool.end();

  if (isValid) {
    console.log("✅ seed.js LULUS");
    process.exit(0);
  } else {
    console.log("❌ seed.js BELUM LULUS");
    process.exit(1);
  }
}

main();
