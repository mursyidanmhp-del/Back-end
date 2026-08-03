const SEED_SISWA = [
  { nama: "Andi", kelas: "12 IPA", nilai: 90 },
  { nama: "Budi", kelas: "12 IPS", nilai: 75 },
  { nama: "Sari", kelas: "11 IPA", nilai: 88 },
  { nama: "Rina", kelas: "11 IPS", nilai: 60 },
];

async function dropTable(pool) {
  await pool.query("DROP TABLE IF EXISTS siswa");
}

async function createBaselineTable(pool) {
  await dropTable(pool);
  await pool.query(`
    CREATE TABLE siswa (
      id SERIAL PRIMARY KEY,
      nama VARCHAR(50) NOT NULL,
      kelas VARCHAR(10),
      nilai INTEGER DEFAULT 0
    )
  `);
}

async function seedBaseline(pool) {
  await createBaselineTable(pool);
  for (const s of SEED_SISWA) {
    await pool.query("INSERT INTO siswa (nama, kelas, nilai) VALUES ($1, $2, $3)", [s.nama, s.kelas, s.nilai]);
  }
}

module.exports = { dropTable, createBaselineTable, seedBaseline, SEED_SISWA };
