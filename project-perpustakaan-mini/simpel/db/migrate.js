// db/migrate.js — RUNNER migration.
//
// Tugasnya: baca semua file .sql di folder db/migrations/, jalanin
// yang BELUM PERNAH dijalanin, urut dari nomor terkecil. File ini gak
// tau apa isi migration-nya (bisa CREATE TABLE, ALTER TABLE, apa
// aja) — dia cuma tukang jalanin & tukang catet.

const fs = require("fs");
const path = require("path");

async function runMigrations(pool, migrationsDir) {
  // Tabel "daftar hadir". IF NOT EXISTS penting — kalau ini gak ada,
  // baris di bawah bakal error tiap kali dijalanin ulang (karena
  // tabelnya udah ada dari run sebelumnya).
  //
  // filename jadi PRIMARY KEY — artinya satu nama file cuma boleh
  // "absen" SEKALI. Ini yang nge-block migration yang sama dijalanin
  // dobel secara tidak sengaja.
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename VARCHAR(255) PRIMARY KEY,
      applied_at TIMESTAMP DEFAULT now()
    )
  `);

  // Ambil daftar file yang UDAH pernah "absen" sebelumnya, taruh di
  // Set (bukan array) — soalnya nanti kita cuma perlu ngecek
  // "file ini ada di sini apa engga", dan .has() di Set jauh lebih
  // cepat daripada .includes() di array.
  const applied = new Set(
    (await pool.query("SELECT filename FROM schema_migrations")).rows.map((r) => r.filename)
  );

  // Baca SEMUA file .sql di folder migrations, urutin abjad/angka.
  // Ini sebabnya migration file HARUS dikasih nomor di depan
  // (001_..., 002_...) — .sort() ngurutinnya sebagai teks, dan
  // "001" < "002" secara teks juga secara logika, jadi urutannya
  // konsisten.
  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  for (const file of files) {
    // Udah pernah jalan? Skip — INI yang bikin migration IDEMPOTENT
    // (aman dijalanin berkali-kali, gak dobel-dobel / gak error
    // "table already exists").
    if (applied.has(file)) continue;

    // Baca ISI file .sql sebagai teks biasa, terus jalanin APA ADANYA
    // ke database. Runner ini gak peduli isinya CREATE TABLE atau
    // ALTER TABLE — itu keputusan yang ditulis di file migration-nya,
    // bukan di sini.
    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
    await pool.query(sql);

    // Begitu berhasil jalan, LANGSUNG dicatet ke schema_migrations —
    // biar run berikutnya tau file ini udah "absen", gak diulang lagi.
    await pool.query("INSERT INTO schema_migrations (filename) VALUES ($1)", [file]);
  }
}

module.exports = { runMigrations };
