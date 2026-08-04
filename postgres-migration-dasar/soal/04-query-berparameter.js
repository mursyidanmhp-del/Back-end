/**
 * SOAL 4 — QUERY BERPARAMETER (AMAN DARI SQL INJECTION)
 *
 * Cerita:
 * Sekarang pakai db.js dari soal 1 buat nambahin data ke tabel buku
 * (dari soal 2). Data judul & penulisnya dianggap datang dari LUAR
 * (misal dari form) — jadi WAJIB pakai placeholder $1/$2, DILARANG
 * nyambung teks langsung ke query.
 *
 * Ketentuan:
 * - require pool dari file db.js soal 1: require("./01-db")
 * - buat async function bernama tambahBuku(judul, penulis) yang:
 *   1. INSERT ke table buku, kolom judul & penulis, pakai VALUES
 *      ($1, $2) — BUKAN template literal / nyambung teks
 *   2. array nilai buat placeholder: [judul, penulis]
 *   3. return baris yang baru diinsert (pakai RETURNING *, lalu ambil
 *      rows[0] dari hasil query)
 * - WAJIB: module.exports = tambahBuku; di baris paling akhir
 * - wajib menggunakan require("./01-db"), async function tambahBuku,
 *   $1, $2, RETURNING *, module.exports
 * - dilarang menggunakan template literal / backtick (`) di dalam
 *   teks query, dan dilarang nyambung teks query pakai tanda plus (+)
 *
 * Cara test (jalankan dari folder postgres-migration-dasar):
 * npm run test:query-berparameter
 */

// TODO: tulis kode kamu di sini
