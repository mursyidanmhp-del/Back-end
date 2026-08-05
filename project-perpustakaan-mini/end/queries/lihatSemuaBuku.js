const pool = require("../config/database");

async function lihatSemuaBuku() {
  const hasil = await pool.query("SELECT * FROM buku ORDER BY id");
  return hasil.rows;
}

module.exports = lihatSemuaBuku;
