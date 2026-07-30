/**
 * SOAL 4 — PROMISE DASAR
 *
 * Cerita:
 * Kenalan pertama kali sama Promise — cara JavaScript "berjanji" bakal
 * ngasih hasil NANTI (gak instan), misalnya kayak nunggu jawaban dari
 * server. Ini dasar yang dipakai di HAMPIR SEMUA query database.
 *
 * Ketentuan:
 * - buat function ambilData yang me-return sebuah new Promise
 * - di dalam Promise itu, pakai setTimeout buat nunggu 100 milidetik,
 *   lalu panggil resolve("Data siswa: Budi")
 * - panggil ambilData().then(...) buat ambil hasilnya, lalu
 *   console.log hasilnya
 * - wajib menggunakan function ambilData, new Promise, setTimeout,
 *   resolve(, .then(
 * - dilarang menggunakan async, await
 *
 * Cara test (jalankan dari folder destructuring-spread-async):
 * npm run test:promise-dasar
 */

// TODO: tulis kode kamu di sini

/**
 * Output yang diharapkan:
 * Data siswa: Budi
 */
