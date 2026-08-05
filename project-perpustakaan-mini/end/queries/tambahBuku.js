const pool = require("../config/database");

async function tambahBuku(judul, penulis, tahunTerbit, stok) {
  const hasil = await pool.query(
    "INSERT INTO buku (judul, penulis, tahun_terbit, stok) VALUES ($1, $2, $3, $4) RETURNING *",
    [judul, penulis, tahunTerbit, stok]
  );
  return hasil.rows[0];
}

module.exports = tambahBuku;
