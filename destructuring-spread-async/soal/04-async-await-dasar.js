/**
 * SOAL 4 — ASYNC/AWAIT DASAR
 *
 * Cerita:
 * Kenalan pertama kali sama async/await — cara nunggu proses yang
 * makan waktu (misalnya kayak nunggu jawaban dari server) TANPA
 * bikin kodenya "macet" nunggu di situ-situ aja.
 *
 * Node.js udah nyediain fungsi tunda siap pakai lewat module bawaan
 * "timers/promises" — kita tinggal require dan await, gak perlu bikin
 * apa-apa dari nol.
 *
 * Ketentuan:
 * - ambil fungsi tunda dari Node.js:
 *   const { setTimeout } = require("timers/promises");
 * - buat function baru bernama main, kasih kata kunci async di
 *   depannya: async function main() { ... }
 * - di dalam main, panggil await setTimeout(100, "Data siswa: Budi"),
 *   simpan hasilnya ke variabel hasil, lalu console.log(hasil)
 * - panggil main() di baris paling akhir
 * - wajib menggunakan require("timers/promises"), async function main,
 *   await, setTimeout
 * - dilarang menggunakan new Promise, .then(, resolve(
 *
 * Cara test (jalankan dari folder destructuring-spread-async):
 * npm run test:async-await-dasar
 */

// TODO: tulis kode kamu di sini

/**
 * Output yang diharapkan:
 * Data siswa: Budi
 */
