/**
 * SOAL 5 — GABUNGAN: ASYNC/AWAIT + DESTRUCTURING
 *
 * Cerita:
 * Ini pola yang bakal kamu ketemu TERUS di Express nanti: nunggu
 * hasil (async/await), hasilnya berupa object, langsung destructuring
 * biar gak perlu simpan ke variabel tambahan.
 *
 * Ketentuan:
 * - ambil fungsi tunda dari Node.js:
 *   const { setTimeout } = require("timers/promises");
 * - buat async function main()
 * - di dalam main, destructuring LANGSUNG dari hasil await:
 *   const { nama, umur } = await setTimeout(100, { nama: "Dinda", umur: 21 });
 * - tampilkan nama pakai console.log, lalu tampilkan umur pakai
 *   console.log
 * - panggil main() di baris paling akhir
 * - wajib menggunakan require("timers/promises"), async function main,
 *   await setTimeout, destructuring "const { nama"
 * - dilarang menggunakan new Promise, .then(, resolve(
 *
 * Cara test (jalankan dari folder destructuring-spread-async):
 * npm run test:gabungan
 */

// TODO: tulis kode kamu di sini
const {setTimeout} = require("timers/promises")
async function main() {
    const {nama, umur} = await setTimeout (100, { nama: "Dinda", umur: 21 })
    console.log(nama);
    console.log(umur);
}

main ()
/**
 * Output yang diharapkan:
 * Dinda
 * 21
 */
