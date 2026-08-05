/**
 * SOAL 5 — SEEDING: ISI DATA CONTOH
 *
 * Cerita:
 * Migration (soal 2 & 3) bikin STRUKTUR tabel buku — tapi tabelnya
 * KOSONG. Tiap kali database di-reset (misal ganti laptop, atau
 * setup ulang), development butuh DATA CONTOH biar gampang dicoba,
 * tanpa harus INSERT manual satu-satu tiap kali. Itu tugasnya seed.
 *
 * Ketentuan:
 * - require pool dari file db.js soal 1: require("./01-db")
 * - buat async function bernama seed() yang:
 *   1. HAPUS dulu semua data lama di tabel buku — pakai:
 *      await pool.query("DELETE FROM buku");
 *      (biar seed AMAN dijalanin berkali-kali, gak numpuk data dobel
 *      tiap dijalanin ulang — konsep yang sama kayak migration di
 *      soal 2/3, cuma sekarang buat DATA bukan STRUKTUR)
 *   2. INSERT 3 buku contoh ini, pakai LOOP (for...of) + placeholder
 *      $1/$2 (BUKAN template literal, sama kayak soal 4):
 *      1. judul: "Laskar Pelangi", penulis: "Andrea Hirata"
 *      2. judul: "Bumi Manusia", penulis: "Pramoedya Ananta Toer"
 *      3. judul: "Negeri 5 Menara", penulis: "Ahmad Fuadi"
 * - WAJIB: module.exports = seed; di baris paling akhir
 * - wajib menggunakan require("./01-db"), async function seed,
 *   DELETE FROM buku, for (buku itu buat looping array, boleh nama
 *   lain kayak "for (const b of ...)"), $1, module.exports
 * - dilarang menggunakan template literal / backtick (`) di query,
 *   dilarang nulis 3 statement INSERT terpisah manual (harus loop)
 *
 * Cara test (jalankan dari folder postgres-migration-dasar):
 * npm run test:seed
 */

// TODO: tulis kode kamu di sini
const pool = require("./01-db")

async function seed(){
    await pool.query("DELETE FROM buku");
    
    const daftarBuku = [
        {judul: "Laskar Pelangi", penulis: "Andrea Hirata"},
        {judul: "Bumi Manusia", penulis: "Pramoedya Ananta Toer"},
        {judul: "Negeri 5 Menara", penulis: "Ahmad Fuadi"}
    ]

     for (const buku of daftarBuku) {
        await pool.query(
          "INSERT INTO buku (judul, penulis) VALUES ($1, $2)",
          [buku.judul, buku.penulis]
        );
      }
}

 module.exports = seed