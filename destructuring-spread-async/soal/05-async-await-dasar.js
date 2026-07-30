/**
 * SOAL 5 — ASYNC/AWAIT DASAR
 *
 * Cerita:
 * Sekarang ganti CARA MANGGIL Promise-nya (bukan cara bikinnya) pakai
 * async/await, supaya kodenya kebaca dari atas ke bawah kayak alur
 * biasa — gak numpuk .then() terus.
 *
 * Ketentuan:
 * - buat function ambilData yang me-return sebuah new Promise (sama
 *   seperti soal sebelumnya): pakai setTimeout 100 milidetik, lalu
 *   resolve("Data siswa: Budi")
 * - buat function baru bernama main, kasih kata kunci async di
 *   depannya: async function main() { ... }
 * - di dalam main, panggil await ambilData(), simpan hasilnya ke
 *   variabel hasil, lalu console.log(hasil)
 * - panggil main() di baris paling akhir
 * - wajib menggunakan async function main, await, new Promise
 * - dilarang menggunakan .then(
 *
 * Cara test (jalankan dari folder destructuring-spread-async):
 * npm run test:async-await-dasar
 */

// TODO: tulis kode kamu di sini

/**
 * Output yang diharapkan:
 * Data siswa: Budi
 */
