/**
 * SOAL 2 — DELETE: HAPUS DATA
 *
 * Cerita:
 * Sekarang giliran HAPUS data dari daftar. Pakai filter (yang udah
 * kamu kuasai dari Fase 0) — bukan cara manual pakai perulangan.
 *
 * Ketentuan:
 * - buat array of objects bernama perpustakaan berisi 2 buku:
 *   1. id: 1, judul: "Laskar Pelangi"
 *   2. id: 2, judul: "Bumi Manusia"
 * - buat app.delete("/buku/:id", ...) yang:
 *   1. menimpa ulang perpustakaan dengan hasil filter — SIMPAN semua
 *      buku KECUALI yang id-nya cocok dengan req.params.id:
 *      perpustakaan = perpustakaan.filter(function (b) {
 *        return b.id !== Number(req.params.id);
 *      });
 *   2. membalas dengan
 *      res.status(200).json({ pesan: "Buku dihapus", sisa: perpustakaan.length })
 * - WAJIB: module.exports = app; di baris paling akhir
 * - DILARANG menulis app.listen(...) di file ini
 * - wajib menggunakan express, app.delete, filter, req.params,
 *   res.status, perpustakaan
 * - dilarang menggunakan app.listen, app.get, app.post, app.put,
 *   splice, for, while
 *
 * Cara test (jalankan dari folder express-crud-lengkap):
 * npm run test:delete
 */

// TODO: tulis kode kamu di sini
const express = require("express");
const app = express();

app.use(express.json());

let perpustakaan = [
  { id: 1, judul: "Laskar Pelangi" },
  { id: 2, judul: "Bumi Manusia" },
];

app.delete("/buku/:id", (req, res) => {
    
    perpustakaan = perpustakaan.filter(function(b){
        return b.id !== Number(req.params.id)
    })
    res.status(200).json({ pesan: "Buku dihapus", sisa: perpustakaan.length })
})
module.exports = app
/**
 * Kalau diakses DELETE ke "/buku/1", diharapkan:
 * - status: 200
 * - body: { "pesan": "Buku dihapus", "sisa": 1 }
 */
