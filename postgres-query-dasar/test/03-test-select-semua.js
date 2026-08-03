const fs = require("fs");
const path = require("path");
const { pool, checkConnection } = require("./db");
const { stripComments } = require("./strip-comments");
const { seedBaseline, SEED_SISWA } = require("./fixture");

const fileName = "03-select-semua.sql";
const filePath = path.join(__dirname, "..", "soal", fileName);

const requiredWords = ["SELECT", "*", "SISWA"];
const forbiddenWords = ["WHERE", "DROP", "DELETE", "UPDATE", "INSERT", "TRUNCATE"];

console.log("================================");
console.log("Menjalankan test select-semua.sql");
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
      console.log(`❌ select-semua.sql wajib menggunakan "${word}"`);
      isValid = false;
    } else {
      console.log(`✅ menggunakan "${word}"`);
    }
  });

  forbiddenWords.forEach((word) => {
    if (sqlUpper.includes(word)) {
      console.log(`❌ select-semua.sql tidak boleh menggunakan "${word}"`);
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
    const rows = [...res.rows].sort((a, b) => a.id - b.id);

    if (rows.length !== SEED_SISWA.length) {
      console.log(`❌ Jumlah baris belum sesuai: diharapkan ${SEED_SISWA.length}, dapat ${rows.length}`);
      isValid = false;
    } else {
      SEED_SISWA.forEach((exp, i) => {
        const row = rows[i];
        if (!row || row.nama !== exp.nama || row.kelas !== exp.kelas || Number(row.nilai) !== exp.nilai || row.id === undefined) {
          console.log(`❌ Baris ke-${i + 1} belum sesuai, dapat: ${JSON.stringify(row)}`);
          isValid = false;
        } else {
          console.log(`✅ Baris ke-${i + 1} sesuai: ${exp.nama}`);
        }
      });
    }
  } catch (err) {
    console.log(`❌ select-semua.sql error saat dijalankan ke database: ${err.message}`);
    isValid = false;
  }

  await pool.end();

  if (isValid) {
    console.log("✅ select-semua.sql LULUS");
    process.exit(0);
  } else {
    console.log("❌ select-semua.sql BELUM LULUS");
    process.exit(1);
  }
}

main();
