/**
 * SOAL 1 — PUT: UPDATE DATA
 *
 * Cerita:
 * Sejauh ini kamu bisa AMBIL data (GET) dan BIKIN data baru (POST).
 * Sekarang gimana kalau mau UBAH data yang SUDAH ADA? Itu tugasnya
 * method PUT.
 *
 * Ketentuan:
 * - buat array of objects bernama perpustakaan berisi 2 buku:
 *   1. id: 1, judul: "Laskar Pelangi"
 *   2. id: 2, judul: "Bumi Manusia"
 * - pasang middleware: app.use(express.json());
 * - buat app.put("/buku/:id", ...) yang:
 *   1. mencari 1 buku dari perpustakaan pakai find (bandingkan
 *      b.id === Number(req.params.id))
 *   2. mengubah buku.judul jadi req.body.judul
 *   3. membalas dengan res.status(200).json(buku)
 * - WAJIB: module.exports = app; di baris paling akhir
 * - DILARANG menulis app.listen(...) di file ini
 * - wajib menggunakan express, app.use, app.put, find, req.params,
 *   req.body, res.status, perpustakaan
 * - dilarang menggunakan app.listen, app.get, app.post, app.delete,
 *   for, while
 *
 * Cara test (jalankan dari folder express-crud-lengkap):
 * npm run test:put-update
 */

// TODO: tulis kode kamu di sini
const express = require("express");
const app = express();

let perpustakaan = [
  { id: 1, judul: "Laskar Pelangi" },
  { id: 2, judul: "Bumi Manusia" },
];
app.use(express.json());

app.put("/buku/:id", (req, res) => {
 let buku = perpustakaan.find(function (b) {
  return b.id === Number(req.params.id)
  })
  buku.judul = req.body.judul
  res.status(200).json(buku);
});

module.exports = app

/**
 * Kalau diakses PUT ke "/buku/2" dengan body { "judul": "Bumi Manusia Baru" },
 * diharapkan:
 * - status: 200
 * - body: { "id": 2, "judul": "Bumi Manusia Baru" }
 */
