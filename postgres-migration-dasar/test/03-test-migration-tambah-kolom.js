const fs = require("fs");
const os = require("os");
const path = require("path");
const { pool, checkConnection } = require("./db");
const { stripComments } = require("./strip-comments");
const { dropBuku } = require("./fixture");
const { runMigrations } = require("./migrate");

const fileName = "03-migration-tambah-kolom.sql";
const filePath = path.join(__dirname, "..", "soal", fileName);

const requiredWords = ["ALTER TABLE", "BUKU", "ADD COLUMN", "STOK", "INTEGER", "DEFAULT"];
const forbiddenWords = ["CREATE TABLE", "DROP TABLE", "DROP DATABASE", "TRUNCATE"];

// migration referensi (BUKAN jawaban murid) — biar test soal 3 gak
// bergantung ke jawaban soal 2 murid
const REFERENSI_001 = `
  CREATE TABLE buku (
    id SERIAL PRIMARY KEY,
    judul VARCHAR(100) NOT NULL,
    penulis VARCHAR(100)
  )
`;

console.log("================================");
console.log("Menjalankan test migration-tambah-kolom.sql");
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
      console.log(`❌ migration-tambah-kolom.sql wajib menggunakan "${word}"`);
      isValid = false;
    } else {
      console.log(`✅ menggunakan "${word}"`);
    }
  });

  forbiddenWords.forEach((word) => {
    if (sqlUpper.includes(word)) {
      console.log(`❌ migration-tambah-kolom.sql tidak boleh menggunakan "${word}"`);
      isValid = false;
    }
  });

  if (!(await checkConnection())) {
    process.exit(1);
  }

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "migrasi-03-"));
  fs.writeFileSync(path.join(tmpDir, "001_create_buku.sql"), REFERENSI_001);
  fs.writeFileSync(path.join(tmpDir, "002_tambah_kolom_stok.sql"), sqlOnly);

  try {
    await dropBuku(pool);
    await runMigrations(pool, tmpDir);
  } catch (err) {
    console.log(`❌ migration-tambah-kolom.sql error waktu dijalanin lewat runner: ${err.message}`);
    await pool.end();
    process.exit(1);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }

  try {
    const cols = await pool.query(
      `SELECT column_name, data_type, column_default
       FROM information_schema.columns WHERE table_name = 'buku'`
    );
    const byName = {};
    cols.rows.forEach((c) => (byName[c.column_name] = c));

    if (!byName.judul || !byName.id) {
      console.log("❌ Kolom lama (id, judul) dari migration 001 ilang — ALTER TABLE seharusnya cuma NAMBAH kolom, bukan bikin ulang tabel");
      isValid = false;
    } else {
      console.log("✅ Kolom lama (id, judul, penulis) masih utuh");
    }

    if (!byName.stok || byName.stok.data_type !== "integer" || byName.stok.column_default === null || byName.stok.column_default.trim() !== "0") {
      console.log("❌ Kolom \"stok\" belum sesuai spesifikasi (INTEGER DEFAULT 0)");
      isValid = false;
    } else {
      console.log('✅ Kolom "stok" sesuai (INTEGER DEFAULT 0)');
    }

    const tercatat = await pool.query(
      "SELECT filename FROM schema_migrations WHERE filename IN ('001_create_buku.sql', '002_tambah_kolom_stok.sql') ORDER BY filename"
    );
    if (tercatat.rows.length !== 2) {
      console.log("❌ Kedua migration belum tercatat lengkap di schema_migrations");
      isValid = false;
    } else {
      console.log("✅ Kedua migration tercatat di schema_migrations, berurutan");
    }
  } catch (err) {
    console.log(`❌ Gagal memeriksa struktur tabel: ${err.message}`);
    isValid = false;
  }

  await pool.end();

  if (isValid) {
    console.log("✅ migration-tambah-kolom.sql LULUS");
    process.exit(0);
  } else {
    console.log("❌ migration-tambah-kolom.sql BELUM LULUS");
    process.exit(1);
  }
}

main();
