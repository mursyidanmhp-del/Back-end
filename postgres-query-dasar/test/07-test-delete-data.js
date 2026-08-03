const fs = require("fs");
const path = require("path");
const { pool, checkConnection } = require("./db");
const { stripComments } = require("./strip-comments");
const { seedBaseline } = require("./fixture");

const fileName = "07-delete-data.sql";
const filePath = path.join(__dirname, "..", "soal", fileName);

const requiredWords = ["DELETE", "FROM", "SISWA", "WHERE", "RINA"];
const forbiddenWords = ["DROP", "UPDATE", "INSERT", "TRUNCATE"];

console.log("================================");
console.log("Menjalankan test delete-data.sql");
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
      console.log(`❌ delete-data.sql wajib menggunakan "${word}"`);
      isValid = false;
    } else {
      console.log(`✅ menggunakan "${word}"`);
    }
  });

  forbiddenWords.forEach((word) => {
    if (sqlUpper.includes(word)) {
      console.log(`❌ delete-data.sql tidak boleh menggunakan "${word}"`);
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
    console.log(`❌ delete-data.sql error saat dijalankan ke database: ${err.message}`);
    await pool.end();
    process.exit(1);
  }

  try {
    const res = await pool.query("SELECT nama FROM siswa ORDER BY id");
    const namaTersisa = res.rows.map((r) => r.nama).sort();
    const expected = ["Andi", "Budi", "Sari"].sort();

    if (namaTersisa.includes("Rina")) {
      console.log('❌ "Rina" masih ada di table, harusnya sudah kehapus');
      isValid = false;
    } else {
      console.log('✅ "Rina" sudah kehapus');
    }

    if (JSON.stringify(namaTersisa) !== JSON.stringify(expected)) {
      console.log(`❌ Siswa lain ikut kehapus: diharapkan ${JSON.stringify(expected)}, dapat ${JSON.stringify(namaTersisa)}`);
      isValid = false;
    } else {
      console.log("✅ Siswa lain tidak ikut kehapus");
    }
  } catch (err) {
    console.log(`❌ Gagal memeriksa hasil delete: ${err.message}`);
    isValid = false;
  }

  await pool.end();

  if (isValid) {
    console.log("✅ delete-data.sql LULUS");
    process.exit(0);
  } else {
    console.log("❌ delete-data.sql BELUM LULUS");
    process.exit(1);
  }
}

main();
