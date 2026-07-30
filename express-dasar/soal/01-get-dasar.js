/**
 * SOAL 1 — GET DASAR
 *
 * Cerita:
 * Bikin "restoran" (server) pertama kamu. Buat 1 route yang bisa
 * diakses dan ngebalikin sebuah teks.
 *
 * Ketentuan:
 * - buat app Express: const app = express();
 * - buat route app.get("/", ...) yang membalas dengan
 *   res.send("Halo dari Express!")
 * - WAJIB: module.exports = app; di baris paling akhir
 * - DILARANG menulis app.listen(...) di file ini
 * - wajib menggunakan express, app.get, res.send
 * - dilarang menggunakan app.listen, app.post, if, for, while
 *
 * Cara test (jalankan dari folder exercise/express-dasar):
 * npm run test:get-dasar
 */

// TODO: tulis kode kamu di sini
const express = require("express")
const app = express()

app.get("/", (req, res) => {
    res.send("Halo dari Express!")
})

module.exports = app
/**
 * Kalau diakses GET ke "/", diharapkan:
 * - status: 200
 * - text: "Halo dari Express!"
 */
