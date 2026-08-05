/**
 * TUGAS 9 — GABUNGIN SEMUANYA
 *
 * Isi tiap TODO di bawah, urutannya JANGAN diubah (tiap langkah
 * butuh langkah sebelumnya udah beres).
 */
require("dotenv").config();

const pool = require("./config/database");
const { runMigrations } = require("./db/migrate");
const seed = require("./db/seeders/seed");
const tambahBuku = require("./queries/tambahBuku");
const lihatSemuaBuku = require("./queries/lihatSemuaBuku");
const cariBuku = require("./queries/cariBuku");
const updateStokBuku = require("./queries/updateStokBuku");
const hapusBuku = require("./queries/hapusBuku");

async function main() {
  console.log("================================");
  console.log("1. Jalankan migration");
  console.log("================================");
  // TODO: panggil runMigrations(pool, __dirname + "/db/migrations")

  console.log("\n================================");
  console.log("2. Jalankan seed");
  console.log("================================");
  // TODO: panggil seed()

  console.log("\n================================");
  console.log("3. Lihat semua buku (awal)");
  console.log("================================");
  // TODO: panggil lihatSemuaBuku(), tampilin pakai console.table

  console.log("\n================================");
  console.log("4. Tambah buku baru");
  console.log("================================");
  // TODO: panggil tambahBuku(...) — judul/penulis/tahun/stok bebas,
  // SIMPAN hasilnya ke variabel (dipakai lagi di langkah 6)

  console.log("\n================================");
  console.log("5. Cari buku (kata kunci bebas)");
  console.log("================================");
  // TODO: panggil cariBuku(...), tampilin pakai console.table

  console.log("\n================================");
  console.log("6. Update stok buku yang baru ditambah");
  console.log("================================");
  // TODO: panggil updateStokBuku(...) pakai id dari langkah 4

  console.log("\n================================");
  console.log("7. Hapus salah satu buku SEED (bukan yang baru ditambah)");
  console.log("================================");
  // TODO: panggil hapusBuku(...) — cari dulu id-nya lewat
  // lihatSemuaBuku(), JANGAN hardcode angka id

  console.log("\n================================");
  console.log("8. Lihat semua buku (akhir)");
  console.log("================================");
  // TODO: panggil lihatSemuaBuku() lagi, tampilin pakai console.table

  await pool.end();
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
