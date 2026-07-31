/**
 * SOAL 1 — DESTRUCTURING OBJECT
 *
 * Cerita:
 * Selama ini kalau mau ambil beberapa data dari satu object, kita
 * ambil satu-satu pakai titik (siswa.nama, siswa.nilai). Destructuring
 * itu cara ambil BEBERAPA SEKALIGUS dalam satu baris.
 *
 * Ketentuan:
 * - buat object bernama siswa:
 *   { nama: "Andi", kelas: "12 IPA", nilai: 90 }
 * - ambil nama dan nilai pakai destructuring dalam SATU baris:
 *   const { nama, nilai } = siswa;
 * - tampilkan nama pakai console.log, lalu tampilkan nilai pakai
 *   console.log
 * - wajib menggunakan const, siswa, destructuring "{ nama"
 * - dilarang mengakses siswa.nama atau siswa.nilai pakai titik
 * - dilarang menggunakan let, var, function, if, for, while
 *
 * Cara test (jalankan dari folder destructuring-spread-async):
 * npm run test:destructuring-object
 */

// TODO: tulis kode kamu di sini
siswa = { nama: "Andi", kelas: "12 IPA", nilai: 90, };

const { nama, nilai } = siswa;
console.log(nama);
console.log(nilai);

/**
 * Output yang diharapkan:
 * Andi
 * 90
 */
