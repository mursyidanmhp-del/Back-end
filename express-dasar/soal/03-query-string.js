/**
 * SOAL 3 — QUERY STRING
 *
 * Cerita:
 * Bikin route yang nerima "catatan tambahan" lewat query string
 * (ditulis pakai ? di URL, contoh: /cari?keyword=laptop).
 *
 * Ketentuan:
 * - buat route app.get("/cari", ...) yang membalas dengan
 *   res.send("Mencari: " + req.query.keyword)
 * - WAJIB: module.exports = app; di baris paling akhir
 * - DILARANG menulis app.listen(...) di file ini
 * - wajib menggunakan express, app.get, req.query, res.send
 * - dilarang menggunakan app.listen, app.post, if, for, while
 *
 * Cara test (jalankan dari folder exercise/express-dasar):
 * npm run test:query-string
 */

// TODO: tulis kode kamu di sini
const express = require("express")
const app = (express())


app.get("/cari", (req, res) => {
    res.send("Mencari: " + req.query.keyword)
})

module.exports = app
/**
 * Kalau diakses GET ke "/cari?keyword=laptop", diharapkan:
 * - status: 200
 * - text: "Mencari: laptop"
 */
