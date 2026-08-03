const fs = require("fs");
const path = require("path");
const { pool, checkConnection } = require("./db");
const { stripComments } = require("./strip-comments");
const { dropTable } = require("./fixture");

const fileName = "01-create-table.sql";
const filePath = path.join(__dirname, "..", "soal", fileName);

const requiredWords = ["CREATE TABLE", "SERIAL", "PRIMARY KEY", "VARCHAR", "NOT NULL", "DEFAULT"];
const forbiddenWords = ["DROP TABLE", "DROP DATABASE", "TRUNCATE"];

console.log("================================");
console.log("Menjalankan test create-table.sql");
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
      console.log(`❌ create-table.sql wajib menggunakan "${word}"`);
      isValid = false;
    } else {
      console.log(`✅ menggunakan "${word}"`);
    }
  });

  forbiddenWords.forEach((word) => {
    if (sqlUpper.includes(word)) {
      console.log(`❌ create-table.sql tidak boleh menggunakan "${word}"`);
      isValid = false;
    }
  });

  if (!(await checkConnection())) {
    process.exit(1);
  }

  try {
    await dropTable(pool);
    await pool.query(sqlOnly);
  } catch (err) {
    console.log(`❌ create-table.sql error saat dijalankan ke database: ${err.message}`);
    await pool.end();
    process.exit(1);
  }

  try {
    const cols = await pool.query(
      `SELECT column_name, data_type, is_nullable, column_default, character_maximum_length
       FROM information_schema.columns WHERE table_name = 'siswa'`
    );

    const byName = {};
    cols.rows.forEach((c) => (byName[c.column_name] = c));

    const checks = [
      ["id (SERIAL)", () => byName.id && byName.id.column_default && byName.id.column_default.includes("nextval")],
      ["nama (VARCHAR(50) NOT NULL)", () => byName.nama && byName.nama.data_type === "character varying" && byName.nama.character_maximum_length === 50 && byName.nama.is_nullable === "NO"],
      ["kelas (VARCHAR)", () => byName.kelas && byName.kelas.data_type === "character varying"],
      ["nilai (INTEGER DEFAULT 0)", () => byName.nilai && byName.nilai.data_type === "integer" && byName.nilai.column_default !== null && byName.nilai.column_default.trim() === "0"],
    ];

    checks.forEach(([label, fn]) => {
      if (!fn()) {
        console.log(`❌ Kolom "${label}" belum sesuai spesifikasi`);
        isValid = false;
      } else {
        console.log(`✅ Kolom "${label}" sesuai`);
      }
    });

    const pk = await pool.query(`
      SELECT a.attname FROM pg_index i
      JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
      WHERE i.indrelid = 'siswa'::regclass AND i.indisprimary
    `);

    if (!pk.rows.some((r) => r.attname === "id")) {
      console.log('❌ Kolom "id" belum jadi PRIMARY KEY');
      isValid = false;
    } else {
      console.log('✅ Kolom "id" adalah PRIMARY KEY');
    }
  } catch (err) {
    console.log(`❌ Gagal memeriksa struktur tabel: ${err.message}`);
    isValid = false;
  }

  await pool.end();

  if (isValid) {
    console.log("✅ create-table.sql LULUS");
    process.exit(0);
  } else {
    console.log("❌ create-table.sql BELUM LULUS");
    process.exit(1);
  }
}

main();
