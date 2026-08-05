// db/seeders/seed.js — isi tabel buku dengan DATA CONTOH.
//
// Bedanya sama migration: migration ngurusin STRUKTUR (kolom apa
// aja yang ada), seed ngurusin ISI (data buat development/testing).
// Makanya seed gak perlu sistem penomoran/schema_migrations kayak
// migration — boleh dijalanin ulang kapan aja pas butuh reset data.

const pool = require("../../config/database");

async function seed() {
  // WAJIB DELETE DULU sebelum isi ulang. Coba bayangin kalau baris
  // ini dihapus: tiap kali seed() dipanggil, 3 buku baru NUMPUK di
  // atas data lama — jalan 2x jadi 6 baris, jalan 5x jadi 15 baris.
  // DELETE dulu = "kosongin dulu raknya, baru diisi ulang dari nol."
  // Ini bikin seed() IDEMPOTENT, sama kayak migration.
  await pool.query("DELETE FROM buku");

  // Data contoh disiapin sebagai ARRAY OF OBJECTS dulu — bukan
  // langsung nulis 3x pool.query(...) manual. Kenapa? Karena kalau
  // butuh 10 atau 50 buku contoh nanti, cukup nambah item di array
  // ini, TANPA nambah baris kode baru.
  const daftarBuku = [
    { judul: "Laskar Pelangi", penulis: "Andrea Hirata", tahunTerbit: 2005, stok: 4 },
    { judul: "Bumi Manusia", penulis: "Pramoedya Ananta Toer", tahunTerbit: 1980, stok: 2 },
    { judul: "Negeri 5 Menara", penulis: "Ahmad Fuadi", tahunTerbit: 2009, stok: 3 },
  ];

  // Loop tiap buku di array, INSERT satu-satu. Placeholder $1-$4
  // dipakai persis kayak query manual di modul postgres-query-dasar
  // — TIDAK ada bedanya cuma karena datanya sekarang dari array/loop,
  // parameterized query tetep WAJIB.
  for (const buku of daftarBuku) {
    await pool.query(
      "INSERT INTO buku (judul, penulis, tahun_terbit, stok) VALUES ($1, $2, $3, $4)",
      [buku.judul, buku.penulis, buku.tahunTerbit, buku.stok]
    );
  }
}

module.exports = seed;
