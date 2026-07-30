/**
 * SOAL 4 — POST & BODY
 *
 * Cerita:
 * Bikin route yang NERIMA data baru lewat body (bukan lewat alamat
 * URL). Butuh middleware express.json() dulu biar body-nya kebaca.
 *
 * Ketentuan:
 * - pasang middleware: app.use(express.json());
 * - buat route app.post("/buku", ...) yang membalas dengan
 *   res.status(201).json({ judul: req.body.judul, pesan: "Buku ditambahkan" })
 * - WAJIB: module.exports = app; di baris paling akhir
 * - DILARANG menulis app.listen(...) di file ini
 * - wajib menggunakan express, app.use, app.post, req.body, res.status
 * - dilarang menggunakan app.listen, app.get, if, for, while
 *
 * Cara test (jalankan dari folder exercise/express-dasar):
 * npm run test:post-body
 */

// TODO: tulis kode kamu di sini
const express = require("express")
const app = express()

app.use(express.json())

app.post("/buku", (req, res) => {
    res.status(201).json({
        judul: req.body.judul,
        pesan: "Buku ditambahkan"
    })
})

module.exports = app
/**
 * Kalau diakses POST ke "/buku" dengan body { "judul": "Negeri 5 Menara" },
 * diharapkan:
 * - status: 201
 * - body: { "judul": "Negeri 5 Menara", "pesan": "Buku ditambahkan" }
 */
