// index.js — pintu masuk project ini. Jalanin dengan: node index.js
//
// File ini GAK punya logika database sendiri — tugasnya cuma
// MANGGIL fungsi-fungsi dari file lain, BERURUTAN, dan nampilin
// hasilnya. Ini pola yang penting dipahami: logika "ngomong ke
// database" (queries/, db/) dipisah dari logika "urutan proses apa
// yang mau dijalanin" (di sini). Nanti pas masuk MVC, bagian
// "urutan proses" ini yang jadi tugasnya CONTROLLER.

require("dotenv").config(); // load isi file .env ke process.env — WAJIB dipanggil SEBELUM require("./config/database"), karena config/database.js langsung baca process.env pas di-require

const pool = require("./config/database");
const { runMigrations } = require("./db/migrate");
const seed = require("./db/seeders/seed");
const tambahBuku = require("./queries/tambahBuku");
const lihatSemuaBuku = require("./queries/lihatSemuaBuku");
const cariBuku = require("./queries/cariBuku");
const updateStokBuku = require("./queries/updateStokBuku");
const hapusBuku = require("./queries/hapusBuku");

async function main() {
  // Langkah 1 & 2 WAJIB paling depan dan URUTANNYA gak boleh
  // ditukar: migration dulu (biar tabel buku ADA), baru seed
  // (soalnya seed nge-INSERT ke tabel yang migration bikin — kalau
  // dibalik, seed bakal error "table buku does not exist").
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

  // Mulai dari sini baru masuk ke demo CRUD. console.table() dipakai
  // (bukan console.log biasa) khusus buat array of objects — hasilnya
  // ditampilin rapi berbentuk tabel di terminal.
  console.log("\n================================");
  console.log("3. Lihat semua buku (awal)");
  console.log("================================");
  console.table(await lihatSemuaBuku());

  console.log("\n================================");
  console.log("4. Tambah buku baru");
  console.log("================================");
  // Hasilnya DISIMPAN ke variabel bukuBaru — soalnya bukuBaru.id
  // dipakai lagi di langkah 6 (update stok). Ini alasan kenapa
  // tambahBuku() di-desain buat RETURNING * dan balikin baris
  // barunya: biar id yang di-generate otomatis sama database bisa
  // dipakai lagi di kode.
  const bukuBaru = await tambahBuku("Sang Pemimpi", "Andrea Hirata", 2006, 5);
  console.log("Buku baru:", bukuBaru);

  console.log("\n================================");
  console.log("5. Cari buku (kata kunci: \"Bumi\")");
  console.log("================================");
  console.table(await cariBuku("Bumi"));

  console.log("\n================================");
  console.log("6. Update stok buku yang baru ditambah");
  console.log("================================");
  // bukuBaru.id di sini — BUKAN angka yang di-hardcode manual —
  // itulah kenapa langkah 4 harus nyimpen hasilnya duluan.
  const bukuDiupdate = await updateStokBuku(bukuBaru.id, 10);
  console.log("Setelah diupdate:", bukuDiupdate);

  console.log("\n================================");
  console.log("7. Hapus salah satu buku seed (Negeri 5 Menara)");
  console.log("================================");
  // PENTING: id yang mau dihapus dicari dulu lewat lihatSemuaBuku()
  // + .find(), BUKAN ditebak/di-hardcode angka. Kenapa? Karena id
  // hasil SERIAL itu OTOMATIS nambah terus tiap kali migration+seed
  // dijalanin ulang (lihat catatan di README) — jadi id buku
  // "Negeri 5 Menara" BISA BEDA tiap run. Cari berdasarkan data yang
  // PASTI (judulnya), bukan asumsi angka yang KEBETULAN benar.
  const semuaBuku = await lihatSemuaBuku();
  const targetHapus = semuaBuku.find((b) => b.judul === "Negeri 5 Menara");
  const bukuTerhapus = await hapusBuku(targetHapus.id);
  console.log("Buku yang dihapus:", bukuTerhapus);

  console.log("\n================================");
  console.log("8. Lihat semua buku (akhir)");
  console.log("================================");
  console.table(await lihatSemuaBuku());

  // pool.end() itu WAJIB di baris PALING TERAKHIR. Pool nyimpen
  // koneksi yang "nyala" di background — kalau ini gak dipanggil,
  // proses node-nya GAK BAKAL BERHENTI SENDIRI (nge-hang), soalnya
  // Node nunggu semua koneksi ditutup dulu sebelum proses selesai.
  await pool.end();
}

// .catch() di sini nangkep kalau ADA AJA error di sepanjang main()
// (misal database mati di tengah jalan, atau ada bug di salah satu
// query) — tanpa ini, error di dalam async function bakal "senyap",
// gak kelihatan jelas di terminal knapa scriptnya berhenti.
main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
