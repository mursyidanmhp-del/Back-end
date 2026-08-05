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
  await runMigrations(pool, __dirname + "/db/migrations");
  console.log("✅ Migration beres — tabel buku siap.");

  console.log("\n================================");
  console.log("2. Jalankan seed");
  console.log("================================");
  await seed();
  console.log("✅ Seed beres — 3 buku contoh sudah masuk.");

  console.log("\n================================");
  console.log("3. Lihat semua buku (awal)");
  console.log("================================");
  console.table(await lihatSemuaBuku());

  console.log("\n================================");
  console.log("4. Tambah buku baru");
  console.log("================================");
  const bukuBaru = await tambahBuku("Sang Pemimpi", "Andrea Hirata", 2006, 5);
  console.log("Buku baru:", bukuBaru);

  console.log("\n================================");
  console.log("5. Cari buku (kata kunci: \"Bumi\")");
  console.log("================================");
  console.table(await cariBuku("Bumi"));

  console.log("\n================================");
  console.log("6. Update stok buku yang baru ditambah");
  console.log("================================");
  const bukuDiupdate = await updateStokBuku(bukuBaru.id, 10);
  console.log("Setelah diupdate:", bukuDiupdate);

  console.log("\n================================");
  console.log("7. Hapus salah satu buku seed (Negeri 5 Menara)");
  console.log("================================");
  const semuaBuku = await lihatSemuaBuku();
  const targetHapus = semuaBuku.find((b) => b.judul === "Negeri 5 Menara");
  const bukuTerhapus = await hapusBuku(targetHapus.id);
  console.log("Buku yang dihapus:", bukuTerhapus);

  console.log("\n================================");
  console.log("8. Lihat semua buku (akhir)");
  console.log("================================");
  console.table(await lihatSemuaBuku());

  await pool.end();
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
