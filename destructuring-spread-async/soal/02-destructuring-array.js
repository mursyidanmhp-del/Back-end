/**
 * SOAL 2 — DESTRUCTURING ARRAY (DENGAN SKIP)
 *
 * Cerita:
 * Destructuring juga bisa dipakai di array, bukan cuma object. Kita
 * juga bisa "melompati" elemen yang gak dibutuhin pakai koma kosong.
 *
 * Ketentuan:
 * - buat array bernama ranking: ["Budi", "Sari", "Rina"]
 * - ambil elemen pertama jadi juara1, LOMPATI elemen kedua, ambil
 *   elemen ketiga jadi juara3 — semua dalam SATU baris destructuring:
 *   const [juara1, , juara3] = ranking;
 * - tampilkan juara1 pakai console.log, lalu tampilkan juara3 pakai
 *   console.log
 * - wajib menggunakan const, ranking, destructuring "[juara1"
 * - dilarang mengakses ranking[0] atau ranking[2] pakai kurung siku
 * - dilarang menggunakan let, var, function, if, for, while
 *
 * Cara test (jalankan dari folder destructuring-spread-async):
 * npm run test:destructuring-array
 */

// TODO: tulis kode kamu di sini
ranking = ["Budi", "Sari", "Rina"]
const [juara1, , juara3] = ranking
console.log(juara1);
console.log(juara3);



/**
 * Output yang diharapkan:
 * Budi
 * Rina
 */
