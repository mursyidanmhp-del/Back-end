const fs = require("fs");
const os = require("os");
const path = require("path");
const { pool, checkConnection } = require("./db");
const { stripComments } = require("./strip-comments");
const { dropBuku } = require("./fixture");
const { runMigrations } = require("./migrate");

const fileName = "02-migration-buat-tabel.sql";
const filePath = path.join(__dirname, "..", "soal", fileName);

const requiredWords = ["CREATE TABLE", "SERIAL", "PRIMARY KEY", "VARCHAR", "NOT NULL"];
const forbiddenWords = ["DROP TABLE", "DROP DATABASE", "TRUNCATE", "ALTER TABLE"];

console.log("================================");
console.log("Menjalankan test migration-buat-tabel.sql");
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
      console.log(`❌ migration-buat-tabel.sql wajib menggunakan "${word}"`);
      isValid = false;
    } else {
      console.log(`✅ menggunakan "${word}"`);
    }
  });

  forbiddenWords.forEach((word) => {
    if (sqlUpper.includes(word)) {
      console.log(`❌ migration-buat-tabel.sql tidak boleh menggunakan "${word}"`);
      isValid = false;
    }
  });

  if (!(await checkConnection())) {
    process.exit(1);
  }

  // siapin folder migrations sementara isi cuma jawaban soal 2
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "migrasi-02-"));
  fs.writeFileSync(path.join(tmpDir, "001_create_buku.sql"), sqlOnly);

  try {
    await dropBuku(pool);
    await runMigrations(pool, tmpDir);
  } catch (err) {
    console.log(`❌ migration-buat-tabel.sql error waktu dijalanin lewat runner: ${err.message}`);
    await pool.end();
    process.exit(1);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }

  try {
    const cols = await pool.query(
      `SELECT column_name, data_type, is_nullable, column_default, character_maximum_length
       FROM information_schema.columns WHERE table_name = 'buku'`
    );
    const byName = {};
    cols.rows.forEach((c) => (byName[c.column_name] = c));

    const checks = [
      ["id (SERIAL)", () => byName.id && byName.id.column_default && byName.id.column_default.includes("nextval")],
      ["judul (VARCHAR(100) NOT NULL)", () => byName.judul && byName.judul.data_type === "character varying" && byName.judul.is_nullable === "NO"],
      ["penulis (VARCHAR)", () => byName.penulis && byName.penulis.data_type === "character varying"],
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
      WHERE i.indrelid = 'buku'::regclass AND i.indisprimary
    `);
    if (!pk.rows.some((r) => r.attname === "id")) {
      console.log('❌ Kolom "id" belum jadi PRIMARY KEY');
      isValid = false;
    } else {
      console.log('✅ Kolom "id" adalah PRIMARY KEY');
    }

    const tercatat = await pool.query("SELECT filename FROM schema_migrations WHERE filename = '001_create_buku.sql'");
    if (tercatat.rows.length === 0) {
      console.log('❌ Migration belum tercatat di schema_migrations (runner belum jalan bener)');
      isValid = false;
    } else {
      console.log("✅ Migration tercatat di schema_migrations");
    }
  } catch (err) {
    console.log(`❌ Gagal memeriksa struktur tabel: ${err.message}`);
    isValid = false;
  }

  await pool.end();

  if (isValid) {
    console.log("✅ migration-buat-tabel.sql LULUS");
    process.exit(0);
  } else {
    console.log("❌ migration-buat-tabel.sql BELUM LULUS");
    process.exit(1);
  }
}

main();
