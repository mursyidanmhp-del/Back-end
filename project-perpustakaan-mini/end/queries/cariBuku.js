// queries/cariBuku.js — READ, versi "ambil yang cocok aja" (huruf R di CRUD).
//
// Ini yang paling gampang disalahartiin: search/filter TETEP harus
// parameterized, sama kayak WHERE biasa. Bedanya cuma nambahin "%"
// di kata kuncinya buat bikin pencarian "mengandung", bukan "sama
// persis".

const pool = require("../config/database");

async function cariBuku(kataKunci) {
  // "%" itu WILDCARD di SQL — artinya "apa aja boleh di sini." Jadi
  // "%bumi%" artinya "judul yang di suatu tempat mengandung teks
  // 'bumi'", bukan "judul yang PERSIS 'bumi'."
  //
  // PENTING: "%" ditempel ke NILAI kataKunci di kode JS (bikin
  // variabel `pola`), BUKAN ditulis manual masuk ke teks query
  // (kayak `WHERE judul ILIKE '%${kataKunci}%'`). Kenapa ini beda?
  // Karena walaupun kataKunci-nya "aneh" (ada tanda kutip dsb), dia
  // tetep masuk lewat placeholder $1 sebagai SATU nilai utuh — sama
  // amannya kayak WHERE = $1 biasa. Wildcard-nya cuma nambah karakter
  // ke NILAI itu, bukan bikin lubang di query-nya.
  const pola = "%" + kataKunci + "%";

  // ILIKE = kayak LIKE, tapi gak peduli huruf besar/kecil ("Bumi"
  // dan "bumi" dianggap sama). Ini yang bikin pencarian lebih natural
  // buat user — mereka gak perlu inget kapitalisasi persis judulnya.
  const hasil = await pool.query("SELECT * FROM buku WHERE judul ILIKE $1 ORDER BY id", [pola]);
  return hasil.rows;
}

module.exports = cariBuku;
