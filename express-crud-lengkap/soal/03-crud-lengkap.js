/**
 * SOAL 3 — CRUD LENGKAP (GABUNGAN SEMUA: GET, POST, PUT, DELETE)
 *
 * Cerita:
 * Ini REST API buku yang BENERAN LENGKAP — gabungan semua method yang
 * udah kamu pelajari dari Express Dasar sampai modul ini.
 *
 * Ketentuan:
 * - buat array of objects bernama perpustakaan berisi 2 buku:
 *   1. id: 1, judul: "Laskar Pelangi"
 *   2. id: 2, judul: "Bumi Manusia"
 * - pasang middleware: app.use(express.json());
 * - app.get("/buku", ...) -> res.status(200).json(perpustakaan)
 * - app.get("/buku/:id", ...) -> cari 1 buku pakai find, balas
 *   res.status(200).json(buku)
 * - app.post("/buku", ...) -> bikin bukuBaru
 *   { id: perpustakaan.length + 1, judul: req.body.judul }, push ke
 *   perpustakaan, balas res.status(201).json(bukuBaru)
 * - app.put("/buku/:id", ...) -> cari buku pakai find, ubah
 *   buku.judul jadi req.body.judul, balas res.status(200).json(buku)
 * - app.delete("/buku/:id", ...) -> timpa ulang perpustakaan pakai
 *   filter (buang yang id-nya cocok), balas
 *   res.status(200).json({ pesan: "Buku dihapus", sisa: perpustakaan.length })
 * - WAJIB: module.exports = app; di baris paling akhir
 * - DILARANG menulis app.listen(...) di file ini
 * - wajib menggunakan express, app.use, app.get, app.post, app.put,
 *   app.delete, find, filter, push, req.params, req.body, res.status,
 *   perpustakaan
 * - dilarang menggunakan app.listen, for, while
 *
 * Cara test (jalankan dari folder express-crud-lengkap):
 * npm run test:crud-lengkap
 */

// TODO: tulis kode kamu di sini

/**
 * Kalau diakses berurutan:
 * - GET /buku -> status 200, array 2 buku
 * - POST /buku dengan body { "judul": "Laut Bercerita" } ->
 *   status 201, body: { id: 3, judul: "Laut Bercerita" }
 * - GET /buku/3 -> status 200, body: { id: 3, judul: "Laut Bercerita" }
 * - PUT /buku/3 dengan body { "judul": "Laut Bercerita Edisi 2" } ->
 *   status 200, body: { id: 3, judul: "Laut Bercerita Edisi 2" }
 * - DELETE /buku/1 -> status 200,
 *   body: { pesan: "Buku dihapus", sisa: 2 }
 */
