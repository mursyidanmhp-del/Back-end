const fs = require("fs");
const path = require("path");
const { pool, checkConnection } = require("./db");
const { stripComments } = require("./strip-comments");
const { seedBaseline } = require("./fixture");

const fileName = "05-order-by-limit.sql";
const filePath = path.join(__dirname, "..", "soal", fileName);

const requiredWords = ["SELECT", "SISWA", "ORDER BY", "DESC", "LIMIT"];
const forbiddenWords = ["DROP", "DELETE", "UPDATE", "INSERT", "TRUNCATE"];

console.log("================================");
console.log("Menjalankan test order-by-limit.sql");
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
      console.log(`❌ order-by-limit.sql wajib menggunakan "${word}"`);
      isValid = false;
    } else {
      console.log(`✅ menggunakan "${word}"`);
    }
  });

  forbiddenWords.forEach((word) => {
    if (sqlUpper.includes(word)) {
      console.log(`❌ order-by-limit.sql tidak boleh menggunakan "${word}"`);
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
    const expected = [
      { nama: "Andi", nilai: 90 },
      { nama: "Sari", nilai: 88 },
    ];

    if (res.rows.length !== expected.length) {
      console.log(`❌ Jumlah baris belum sesuai: diharapkan ${expected.length}, dapat ${res.rows.length}`);
      isValid = false;
    } else {
      expected.forEach((exp, i) => {
        const row = res.rows[i];
        if (!row || row.nama !== exp.nama || Number(row.nilai) !== exp.nilai) {
          console.log(`❌ Urutan ke-${i + 1} belum sesuai, dapat: ${JSON.stringify(row)}`);
          isValid = false;
        } else {
          console.log(`✅ Urutan ke-${i + 1} sesuai: ${exp.nama} (${exp.nilai})`);
        }
      });
    }
  } catch (err) {
    console.log(`❌ order-by-limit.sql error saat dijalankan ke database: ${err.message}`);
    isValid = false;
  }

  await pool.end();

  if (isValid) {
    console.log("✅ order-by-limit.sql LULUS");
    process.exit(0);
  } else {
    console.log("❌ order-by-limit.sql BELUM LULUS");
    process.exit(1);
  }
}

main();
