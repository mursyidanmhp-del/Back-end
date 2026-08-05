const pool = require("../../config/database");

async function seed() {
  await pool.query("DELETE FROM buku");

  const daftarBuku = [
    { judul: "Laskar Pelangi", penulis: "Andrea Hirata", tahunTerbit: 2005, stok: 4 },
    { judul: "Bumi Manusia", penulis: "Pramoedya Ananta Toer", tahunTerbit: 1980, stok: 2 },
    { judul: "Negeri 5 Menara", penulis: "Ahmad Fuadi", tahunTerbit: 2009, stok: 3 },
  ];

  for (const buku of daftarBuku) {
    await pool.query(
      "INSERT INTO buku (judul, penulis, tahun_terbit, stok) VALUES ($1, $2, $3, $4)",
      [buku.judul, buku.penulis, buku.tahunTerbit, buku.stok]
    );
  }
}

module.exports = seed;
