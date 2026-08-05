const pool = require("../config/database");

async function cariBuku(kataKunci) {
  // "%" ditempel di NILAI-nya (bukan di teks query) — placeholder $1
  // tetep yang ngirim ke database, jadi tetep aman dari SQL Injection
  const pola = "%" + kataKunci + "%";
  const hasil = await pool.query("SELECT * FROM buku WHERE judul ILIKE $1 ORDER BY id", [pola]);
  return hasil.rows;
}

module.exports = cariBuku;
