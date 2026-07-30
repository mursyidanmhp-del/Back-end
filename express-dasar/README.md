# 📘 Latihan — Express Dasar

## 📖 Deskripsi

Latihan ini melatih dasar Express: membuat route (`GET`/`POST`), route
parameter, query string, membaca body request, middleware
(`express.json()`), status code, sampai gabungan semuanya jadi CRUD
sederhana di atas array of objects (dari Fase 0).

> 📖 Belum familiar dengan Express? Baca dulu [MATERI.md](MATERI.md) sebelum
> mulai mengerjakan soal di bawah.

---

## ⚠️ PENTING — Beda dari Modul Sebelumnya

Express itu bikin SERVER yang jalan terus-menerus (biasanya lewat
`app.listen(...)`). Tapi supaya soal-soal ini bisa di-test OTOMATIS
tanpa perlu buka port sungguhan, kita pakai alat bernama **supertest**
yang connect LANGSUNG ke `app`-nya.

**Konsekuensinya:**
- Tiap file soal WAJIB diakhiri `module.exports = app;`
- Tiap file soal DILARANG menulis `app.listen(...)` — kalau ada, test
  akan langsung gagal (dan sengaja TIDAK dijalankan sama sekali, biar
  gak bikin proses nge-hang nunggu server yang jalan terus).

Kalau nanti mau coba beneran lewat Postman/browser, boleh nambahin
`app.listen(3000, () => console.log("jalan!"))` sendiri pas nyoba
manual — tapi HAPUS lagi sebelum di-submit/di-test.

---

## 📁 Struktur File

```text
.
├── soal/
│   ├── 01-get-dasar.js
│   ├── 02-route-param.js
│   ├── 03-query-string.js
│   ├── 04-post-body.js
│   └── 05-crud-buku.js
├── test/
│   ├── 01-test-get-dasar.js
│   ├── 02-test-route-param.js
│   ├── 03-test-query-string.js
│   ├── 04-test-post-body.js
│   ├── 05-test-crud-buku.js
│   ├── test-all.js
│   └── strip-comments.js
├── package.json
└── node_modules/ (express, supertest — sudah di-install)
```

> Peserta hanya mengerjakan file di folder `soal/`. File di folder `test/` tidak perlu diubah.

---

## 🧪 Cara Menjalankan Test

```bash
cd exercise/express-dasar
npm test
```

Atau per soal:

```bash
npm run test:get-dasar
npm run test:route-param
npm run test:query-string
npm run test:post-body
npm run test:crud-buku
```

---

# 🧪 SOAL 1 — GET DASAR *(mudah)*

Buat route `GET /` yang membalas dengan teks sederhana.

**Diharapkan:** status 200, text `"Halo dari Express!"`

---

# 🧪 SOAL 2 — ROUTE PARAMETER *(mudah)*

Buat route `GET /sapa/:nama` yang membalas pakai `req.params.nama`.

**Diharapkan:** GET `/sapa/Budi` → status 200, text `"Halo, Budi!"`

---

# 🧪 SOAL 3 — QUERY STRING *(sedang)*

Buat route `GET /cari` yang membaca `req.query.keyword`.

**Diharapkan:** GET `/cari?keyword=laptop` → status 200, text `"Mencari: laptop"`

---

# 🧪 SOAL 4 — POST & BODY *(sedang)*

Buat route `POST /buku` yang membaca `req.body.judul` (butuh
`express.json()`).

**Diharapkan:** POST `/buku` dengan body `{ "judul": "Negeri 5 Menara" }`
→ status 201, body `{ "judul": "Negeri 5 Menara", "pesan": "Buku ditambahkan" }`

---

# 🧪 SOAL 5 — CRUD BUKU (GABUNGAN SEMUA) *(sulit)*

Gabungan `GET /buku`, `GET /buku/:id`, `POST /buku` di atas array of
objects `perpustakaan` — pakai `find` dan `push` yang sudah dikuasai
dari Fase 0.

**Diharapkan:**
- GET `/buku` → status 200, array 2 buku
- GET `/buku/2` → status 200, `{ id: 2, judul: "Bumi Manusia" }`
- POST `/buku` dengan body `{ "judul": "Laut Bercerita" }` → status 201, `{ id: 3, judul: "Laut Bercerita" }`

---

## ⚠️ Ketentuan Wajib

- semua soal: `express`, `module.exports = app;`
- soal 1: `app.get`, `res.send`
- soal 2: `app.get`, `req.params`, `res.send`
- soal 3: `app.get`, `req.query`, `res.send`
- soal 4: `app.use(express.json())`, `app.post`, `req.body`, `res.status`
- soal 5: `app.use`, `app.get`, `app.post`, `find`, `push`, `req.params`, `req.body`, `res.status`

## 🚫 Larangan

- SEMUA soal: dilarang `app.listen(...)` — akan langsung gagal & dibatalkan
- soal 1–3: dilarang `if`, `for`, `while`
- soal 1, 2, 3: dilarang `app.post`
- soal 4: dilarang `app.get`
- mengubah alamat route / nama variabel dari soal
- menggabungkan semua jawaban dalam satu file

---

# 📌 Contoh Hasil Test Berhasil

```bash
npm test
```

```text
================================
Menjalankan semua test Express Dasar
================================
...
================================
HASIL AKHIR
================================
✅ Semua test LULUS
```
