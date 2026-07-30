/**
 * SOAL 6 — GABUNGAN: ASYNC/AWAIT + DESTRUCTURING
 *
 * Cerita:
 * Ini pola yang bakal kamu ketemu TERUS di Express nanti: ambil data
 * (async/await), hasilnya berupa object, langsung destructuring biar
 * gak perlu simpan ke variabel tambahan.
 *
 * Ketentuan:
 * - buat function ambilUser yang me-return sebuah new Promise: pakai
 *   setTimeout 100 milidetik, lalu resolve dengan object
 *   { nama: "Dinda", umur: 21 }
 * - buat async function main()
 * - di dalam main, destructuring LANGSUNG dari hasil await:
 *   const { nama, umur } = await ambilUser();
 * - tampilkan nama pakai console.log, lalu tampilkan umur pakai
 *   console.log
 * - panggil main() di baris paling akhir
 * - wajib menggunakan async function main, await ambilUser, destructuring
 *   "const { nama", new Promise
 * - dilarang menggunakan .then(
 *
 * Cara test (jalankan dari folder destructuring-spread-async):
 * npm run test:gabungan
 */

// TODO: tulis kode kamu di sini

/**
 * Output yang diharapkan:
 * Dinda
 * 21
 */
