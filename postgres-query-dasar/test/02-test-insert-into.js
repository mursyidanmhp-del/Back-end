const fs = require("fs");
const path = require("path");
const { pool, checkConnection } = require("./db");
const { stripComments } = require("./strip-comments");
const { createBaselineTable } = require("./fixture");

const fileName = "02-insert-into.sql";
const filePath = path.join(__dirname, "..", "soal", fileName);

const requiredWords = ["INSERT INTO", "SISWA", "VALUES"];
const forbiddenWords = ["DROP TABLE", "DROP DATABASE", "DELETE FROM", "UPDATE SISWA", "TRUNCATE"];

console.log("================================");
console.log("Menjalankan test insert-into.sql");
console.log("================================");

async function main() {
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File ${fileName} tidak ditemukan`);
    process.exit(1);
  }

  const sql = fs.readFileSync(filePath, "utf8");
  const sqlOnly = stripComments(sql);
  const sqlUpper = sqlOnly.toUpperCase();

  let isValid = true;

  requiredWords.forEach((word) => {
    if (!sqlUpper.includes(word)) {
      console.log(`❌ insert-into.sql wajib menggunakan "${word}"`);
      isValid = false;
    } else {
      console.log(`✅ menggunakan "${word}"`);
    }
  });

  forbiddenWords.forEach((word) => {
    if (sqlUpper.includes(word)) {
      console.log(`❌ insert-into.sql tidak boleh menggunakan "${word}"`);
      isValid = false;
    }
  });

  if (!(await checkConnection())) {
    process.exit(1);
  }

  try {
    await createBaselineTable(pool);
    await pool.query(sqlOnly);
  } catch (err) {
    console.log(`❌ insert-into.sql error saat dijalankan ke database: ${err.message}`);
    await pool.end();
    process.exit(1);
  }

  try {
    const res = await pool.query("SELECT nama, kelas, nilai FROM siswa ORDER BY id");
    const expected = [
      { nama: "Andi", kelas: "12 IPA", nilai: 90 },
      { nama: "Budi", kelas: "12 IPS", nilai: 75 },
      { nama: "Sari", kelas: "11 IPA", nilai: 88 },
    ];

    if (res.rows.length !== expected.length) {
      console.log(`❌ Jumlah baris belum sesuai: diharapkan ${expected.length}, dapat ${res.rows.length}`);
      isValid = false;
    } else {
      expected.forEach((exp, i) => {
        const row = res.rows[i];
        if (row.nama !== exp.nama || row.kelas !== exp.kelas || Number(row.nilai) !== exp.nilai) {
          console.log(`❌ Baris ke-${i + 1} belum sesuai, dapat: ${JSON.stringify(row)}`);
          isValid = false;
        } else {
          console.log(`✅ Baris ke-${i + 1} sesuai: ${exp.nama}`);
        }
      });
    }
  } catch (err) {
    console.log(`❌ Gagal memeriksa isi tabel: ${err.message}`);
    isValid = false;
  }

  await pool.end();

  if (isValid) {
    console.log("✅ insert-into.sql LULUS");
    process.exit(0);
  } else {
    console.log("❌ insert-into.sql BELUM LULUS");
    process.exit(1);
  }
}

main();
