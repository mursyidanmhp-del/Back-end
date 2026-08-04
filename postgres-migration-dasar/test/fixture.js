async function dropBuku(pool) {
  await pool.query("DROP TABLE IF EXISTS buku");
  await pool.query("DROP TABLE IF EXISTS schema_migrations");
}

// baseline "buku" table, dipakai test soal 4 (query-berparameter) —
// dibikin langsung, TIDAK bergantung ke jawaban migration murid di soal 2/3
async function createBaselineBuku(pool) {
  await dropBuku(pool);
  await pool.query(`
    CREATE TABLE buku (
      id SERIAL PRIMARY KEY,
      judul VARCHAR(100) NOT NULL,
      penulis VARCHAR(100)
    )
  `);
}

module.exports = { dropBuku, createBaselineBuku };
