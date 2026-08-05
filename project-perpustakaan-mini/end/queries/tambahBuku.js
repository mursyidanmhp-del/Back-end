// queries/tambahBuku.js — CREATE (huruf C di CRUD).

const pool = require("../config/database");

async function tambahBuku(judul, penulis, tahunTerbit, stok) {
  // $1, $2, $3, $4 — urutannya HARUS SESUAI sama urutan kolom yang
  // disebut di (judul, penulis, tahun_terbit, stok), dan HARUS SESUAI
  // sama urutan array [judul, penulis, tahunTerbit, stok] di bawah.
  // Kalau urutannya ketuker, datanya bakal MASUK KE KOLOM YANG SALAH
  // (bukan error — makanya harus teliti).
  //
  // RETURNING * — tanpa ini, pool.query() cuma ngasih tau "berhasil"
  // doang, gak ngasih tau ISI baris yang baru dibikin (termasuk id-
  // nya, yang di-generate OTOMATIS sama database, bukan sama kode
  // kita). RETURNING * itu cara bilang "abis INSERT, balikin lagi
  // baris yang baru dibikin itu ke saya."
  const hasil = await pool.query(
    "INSERT INTO buku (judul, penulis, tahun_terbit, stok) VALUES ($1, $2, $3, $4) RETURNING *",
    [judul, penulis, tahunTerbit, stok]
  );

  // pool.query() SELALU ngasih balik { rows: [...] }, meskipun cuma
  // ngurus SATU baris — makanya harus .rows[0], bukan langsung
  // "hasil" doang.
  return hasil.rows[0];
}

module.exports = tambahBuku;
