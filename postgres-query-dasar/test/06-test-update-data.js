const fs = require("fs");
const path = require("path");
const { pool, checkConnection } = require("./db");
const { stripComments } = require("./strip-comments");
const { seedBaseline } = require("./fixture");

const fileName = "06-update-data.sql";
const filePath = path.join(__dirname, "..", "soal", fileName);

const requiredWords = ["UPDATE", "SISWA", "SET", "NILAI", "WHERE", "BUDI"];
const forbiddenWords = ["DROP", "DELETE", "INSERT", "TRUNCATE"];

console.log("================================");
console.log("Menjalankan test update-data.sql");
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
      console.log(`❌ update-data.sql wajib menggunakan "${word}"`);
      isValid = false;
    } else {
      console.log(`✅ menggunakan "${word}"`);
    }
  });

  forbiddenWords.forEach((word) => {
    if (sqlUpper.includes(word)) {
      console.log(`❌ update-data.sql tidak boleh menggunakan "${word}"`);
      isValid = false;
    }
  });

  if (!(await checkConnection())) {
    process.exit(1);
  }

  try {
    await seedBaseline(pool);
    await pool.query(sqlOnly);
  } catch (err) {
    console.log(`❌ update-data.sql error saat dijalankan ke database: ${err.message}`);
    await pool.end();
    process.exit(1);
  }

  try {
    const res = await pool.query("SELECT nama, nilai FROM siswa ORDER BY id");
    const expected = {
      Andi: 90,
      Budi: 95,
      Sari: 88,
      Rina: 60,
    };

    Object.entries(expected).forEach(([nama, nilai]) => {
      const row = res.rows.find((r) => r.nama === nama);
      if (!row || Number(row.nilai) !== nilai) {
        console.log(`❌ Nilai "${nama}" belum sesuai: diharapkan ${nilai}, dapat ${row ? row.nilai : "tidak ditemukan"}`);
        isValid = false;
      } else {
        console.log(`✅ Nilai "${nama}" sesuai: ${nilai}`);
      }
    });
  } catch (err) {
    console.log(`❌ Gagal memeriksa hasil update: ${err.message}`);
    isValid = false;
  }

  await pool.end();

  if (isValid) {
    console.log("✅ update-data.sql LULUS");
    process.exit(0);
  } else {
    console.log("❌ update-data.sql BELUM LULUS");
    process.exit(1);
  }
}

main();
