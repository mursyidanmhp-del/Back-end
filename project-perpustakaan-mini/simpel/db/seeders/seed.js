const pool = require("../../config/database");

async function seed() {
  await pool.query("DELETE FROM buku");

  await pool.query(
    "INSERT INTO buku (judul, penulis, stok) VALUES ($1, $2, $3)",
    ["Laskar Pelangi", "Andrea Hirata", 4]
  );
}

module.exports = seed;
