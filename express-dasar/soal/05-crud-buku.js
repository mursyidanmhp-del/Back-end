/**
 * SOAL 5 — CRUD BUKU (GABUNGAN SEMUA MATERI)
 *
 * Cerita:
 * Soal gabungan paling lengkap: pasang array of objects (perpustakaan)
 * dari Fase 0 ke dalam route Express — persis pola yang bakal dipakai
 * pas belajar database nanti.
 *
 * Ketentuan:
 * - buat array of objects bernama perpustakaan berisi 2 buku:
 *   1. id: 1, judul: "Laskar Pelangi"
 *   2. id: 2, judul: "Bumi Manusia"
 * - pasang middleware: app.use(express.json());
 * - buat app.get("/buku", ...) yang membalas dengan
 *   res.status(200).json(perpustakaan) — tampilkan SEMUA buku
 * - buat app.get("/buku/:id", ...) yang mencari 1 buku dari
 *   perpustakaan pakai find (bandingkan b.id === Number(req.params.id)),
 *   lalu membalas dengan res.status(200).json(buku)
 * - buat app.post("/buku", ...) yang bikin bukuBaru
 *   { id: perpustakaan.length + 1, judul: req.body.judul }, push ke
 *   perpustakaan, lalu membalas dengan res.status(201).json(bukuBaru)
 * - WAJIB: module.exports = app; di baris paling akhir
 * - DILARANG menulis app.listen(...) di file ini
 * - wajib menggunakan express, app.use, app.get, app.post, find, push,
 *   req.params, req.body, res.status
 * - dilarang menggunakan app.listen, for, while
 *
 * Cara test (jalankan dari folder exercise/express-dasar):
 * npm run test:crud-buku
 */

// TODO: tulis kode kamu di sini

/**
 * Kalau diakses:
 * - GET /buku -> status 200, body: array 2 buku
 * - GET /buku/2 -> status 200, body: { id: 2, judul: "Bumi Manusia" }
 * - POST /buku dengan body { "judul": "Laut Bercerita" } ->
 *   status 201, body: { id: 3, judul: "Laut Bercerita" }
 */
