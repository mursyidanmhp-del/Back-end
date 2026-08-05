const pool = require("../config/database");

async function updateStokBuku(id, stokBaru) {
  const hasil = await pool.query(
    "UPDATE buku SET stok = $1 WHERE id = $2 RETURNING *",
    [stokBaru, id]
  );
  return hasil.rows[0];
}

module.exports = updateStokBuku;
