// queries/lihatSemuaBuku.js — READ, versi "ambil semua" (huruf R di CRUD).

const pool = require("../config/database");

async function lihatSemuaBuku() {
  // SELECT * = ambil SEMUA kolom. ORDER BY id = urutin dari id
  // terkecil ke terbesar — TANPA ini, urutan baris yang dibalikin
  // database SEBENERNYA gak dijamin konsisten (kelihatannya urut
  // karena kebetulan, bukan karena dijamin).
  //
  // Gak ada WHERE di sini — beda sama cariBuku.js yang nyaring
  // hasilnya. Fungsi ini emang sengaja "ambil semua tanpa syarat."
  const hasil = await pool.query("SELECT * FROM buku ORDER BY id");

  // Beda sama tambahBuku (yang balikin SATU baris lewat .rows[0]),
  // di sini kita balikin hasil.rows LANGSUNG (array-nya, bukan satu
  // elemen) — soalnya "lihat semua" itu WAJAR hasilnya banyak baris.
  return hasil.rows;
}

module.exports = lihatSemuaBuku;
