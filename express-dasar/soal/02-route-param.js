/**
 * SOAL 2 — ROUTE PARAMETER
 *
 * Cerita:
 * Bikin route yang bisa nerima BAGIAN ALAMAT YANG BERUBAH-UBAH, pakai
 * route parameter (:nama).
 *
 * Ketentuan:
 * - buat route app.get("/sapa/:nama", ...) yang membalas dengan
 *   res.send("Halo, " + req.params.nama + "!")
 * - WAJIB: module.exports = app; di baris paling akhir
 * - DILARANG menulis app.listen(...) di file ini
 * - wajib menggunakan express, app.get, req.params, res.send
 * - dilarang menggunakan app.listen, app.post, if, for, while
 *
 * Cara test (jalankan dari folder exercise/express-dasar):
 * npm run test:route-param
 */

// TODO: tulis kode kamu di sini

/**
 * Kalau diakses GET ke "/sapa/Budi", diharapkan:
 * - status: 200
 * - text: "Halo, Budi!"
 */
