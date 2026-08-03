const fs = require("fs");
const path = require("path");
const { pool, checkConnection } = require("./db");
const { stripComments } = require("./strip-comments");
const { seedBaseline } = require("./fixture");

const fileName = "04-where-filter.sql";
const filePath = path.join(__dirname, "..", "soal", fileName);

const requiredWords = ["SELECT", "NAMA", "SISWA", "WHERE", "NILAI"];
const forbiddenWords = ["DROP", "DELETE", "UPDATE", "INSERT", "TRUNCATE"];

console.log("================================");
console.log("Menjalankan test where-filter.sql");
console.log("================================");

async function main() {
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File ${fileName} tidak ditemukan`);
    process.exit(1);
  }

  const sql = fs.readFileSync(filePath, "utf8");
  const sqlOnly = stripComments(sql).trim();
  const sqlUpper = sqlOnly.toUpperCase();

  let isValid = true;

  requiredWords.forEach((word) => {
    if (!sqlUpper.includes(word)) {
      console.log(`❌ where-filter.sql wajib menggunakan "${word}"`);
      isValid = false;
    } else {
      console.log(`✅ menggunakan "${word}"`);
    }
  });

  forbiddenWords.forEach((word) => {
    if (sqlUpper.includes(word)) {
      console.log(`❌ where-filter.sql tidak boleh menggunakan "${word}"`);
      isValid = false;
    }
  });

  if (!(await checkConnection())) {
    process.exit(1);
  }

  try {
    await seedBaseline(pool);
  } catch (err) {
    console.log(`❌ Gagal menyiapkan data tes: ${err.message}`);
    await pool.end();
    process.exit(1);
  }

  try {
    const res = await pool.query(sqlOnly);
    const namaHasil = res.rows.map((r) => r.nama).sort();
    const expected = ["Andi", "Sari"].sort();

    if (res.rows.some((r) => Object.keys(r).length !== 1 || !("nama" in r))) {
      console.log(`❌ Hasil query harus cuma berisi kolom "nama", dapat: ${JSON.stringify(res.rows[0])}`);
      isValid = false;
    } else if (JSON.stringify(namaHasil) !== JSON.stringify(expected)) {
      console.log(`❌ Hasil belum sesuai: diharapkan ${JSON.stringify(expected)}, dapat ${JSON.stringify(namaHasil)}`);
      isValid = false;
    } else {
      console.log(`✅ Hasil sesuai: ${JSON.stringify(namaHasil)}`);
    }
  } catch (err) {
    console.log(`❌ where-filter.sql error saat dijalankan ke database: ${err.message}`);
    isValid = false;
  }

  await pool.end();

  if (isValid) {
    console.log("✅ where-filter.sql LULUS");
    process.exit(0);
  } else {
    console.log("❌ where-filter.sql BELUM LULUS");
    process.exit(1);
  }
}

main();
