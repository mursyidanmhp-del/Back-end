// queries/hapusBuku.js — DELETE (huruf D di CRUD).

const pool = require("../config/database");

async function hapusBuku(id) {
  // Sama kayak updateStokBuku.js: WHERE id = $1 itu WAJIB. Tanpa
  // WHERE, `DELETE FROM buku` bakal ngosongin SELURUH tabel, bukan
  // cuma satu baris. Ini operasi paling BERBAHAYA di CRUD karena gak
  // bisa di-undo (kecuali ada backup) — makanya id yang mau dihapus
  // harus BENERAN dipastiin dulu sebelum manggil fungsi ini (lihat
  // cara index.js manggilnya: cari dulu id-nya lewat lihatSemuaBuku(),
  // gak hardcode angka sembarangan).
  //
  // RETURNING * di DELETE gunanya biar kita tau PERSIS baris mana
  // yang barusan kehapus (isinya, bukan cuma "berhasil"/"gagal") —
  // berguna misalnya buat nampilin pesan "Buku X berhasil dihapus."
  const hasil = await pool.query("DELETE FROM buku WHERE id = $1 RETURNING *", [id]);
  return hasil.rows[0];
}

module.exports = hapusBuku;
