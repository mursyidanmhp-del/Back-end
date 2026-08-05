// queries/updateStokBuku.js — UPDATE (huruf U di CRUD).

const pool = require("../config/database");

async function updateStokBuku(id, stokBaru) {
  // WHERE id = $2 itu BAGIAN PALING PENTING di query ini. Coba
  // dihapus di kepala: `UPDATE buku SET stok = $1` TANPA WHERE bakal
  // ngubah stok SEMUA buku jadi nilai yang sama, bukan cuma satu
  // buku. Ini kesalahan paling sering bikin data production
  // berantakan — WAJIB selalu tanya "query UPDATE/DELETE ini udah
  // ada WHERE-nya belum?"
  //
  // $1 dan $2 urutannya ngikutin urutan array [stokBaru, id] di
  // bawah — $1 = stokBaru (buat SET), $2 = id (buat WHERE). Nomor
  // placeholder gak harus muncul urut kiri-ke-kanan sesuai posisi di
  // query, yang penting COCOK sama urutan di array parameter.
  const hasil = await pool.query(
    "UPDATE buku SET stok = $1 WHERE id = $2 RETURNING *",
    [stokBaru, id]
  );

  // RETURNING * di UPDATE gunanya sama kayak di INSERT — biar kita
  // langsung tau HASIL AKHIR baris itu setelah diubah, tanpa perlu
  // SELECT lagi manual buat ngecek.
  return hasil.rows[0];
}

module.exports = updateStokBuku;
