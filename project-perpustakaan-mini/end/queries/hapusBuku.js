const pool = require("../config/database");

async function hapusBuku(id) {
  const hasil = await pool.query("DELETE FROM buku WHERE id = $1 RETURNING *", [id]);
  return hasil.rows[0];
}

module.exports = hapusBuku;
