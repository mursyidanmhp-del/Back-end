# 📘 Latihan — Express CRUD Lengkap (PUT & DELETE)

## 📖 Deskripsi

Lanjutan dari [express-dasar](../express-dasar). Modul itu udah nutup
GET dan POST — modul ini nutup 2 method yang tersisa: **PUT** (update
data) dan **DELETE** (hapus data), lalu ditutup dengan REST API buku
yang BENERAN lengkap (5 method sekaligus).

> 📖 Belum familiar dengan materi ini? Baca dulu
> [MATERI.md](MATERI.md) sebelum mulai mengerjakan soal di bawah.

---

## ⚠️ PENTING — Sama Seperti Express Dasar

Tiap file soal WAJIB diakhiri `module.exports = app;` dan DILARANG
menulis `app.listen(...)` — cara test-nya connect langsung ke `app`
pakai **supertest**, bukan lewat port sungguhan.

---

## 📁 Struktur File

```text
.
├── soal/
│   ├── 01-put-update.js
│   ├── 02-delete.js
│   └── 03-crud-lengkap.js
├── test/
│   ├── 01-test-put-update.js
│   ├── 02-test-delete.js
│   ├── 03-test-crud-lengkap.js
│   ├── test-all.js
│   └── strip-comments.js
├── package.json
└── node_modules/ (express, supertest — sudah di-install)
```

> Peserta hanya mengerjakan file di folder `soal/`. File di folder
> `test/` tidak perlu diubah.

---

## 🧪 Cara Menjalankan Test

```bash
cd express-crud-lengkap
npm test
```

Atau per soal:

```bash
npm run test:put-update
npm run test:delete
npm run test:crud-lengkap
```

---

# 🧪 SOAL 1 — PUT: UPDATE DATA *(sedang)*

Cari 1 buku pakai `find`, ubah `judul`-nya sesuai `req.body.judul`.

**Diharapkan:** PUT `/buku/2` dengan body `{ "judul": "Bumi Manusia Baru" }`
→ status 200, body `{ "id": 2, "judul": "Bumi Manusia Baru" }`

---

# 🧪 SOAL 2 — DELETE: HAPUS DATA *(sedang)*

Timpa ulang array pakai `filter` — simpan semua buku KECUALI yang mau
dihapus.

**Diharapkan:** DELETE `/buku/1` → status 200, body
`{ "pesan": "Buku dihapus", "sisa": 1 }`

---

# 🧪 SOAL 3 — CRUD LENGKAP (GABUNGAN 5 METHOD) *(sulit)*

Gabungan GET semua, GET satu, POST, PUT, DELETE — REST API buku yang
utuh.

**Diharapkan (berurutan):**
- GET `/buku` → 200, array 2 buku
- POST `/buku` body `{ "judul": "Laut Bercerita" }` → 201, `{ id: 3, judul: "Laut Bercerita" }`
- GET `/buku/3` → 200, `{ id: 3, judul: "Laut Bercerita" }`
- PUT `/buku/3` body `{ "judul": "Laut Bercerita Edisi 2" }` → 200, `{ id: 3, judul: "Laut Bercerita Edisi 2" }`
- DELETE `/buku/1` → 200, `{ pesan: "Buku dihapus", sisa: 2 }`

---

## ⚠️ Ketentuan Wajib

- semua soal: `express`, `module.exports = app;`
- soal 1: `app.use`, `app.put`, `find`, `req.params`, `req.body`, `res.status`, `perpustakaan`
- soal 2: `app.delete`, `filter`, `req.params`, `res.status`, `perpustakaan`
- soal 3: `app.use`, `app.get`, `app.post`, `app.put`, `app.delete`, `find`, `filter`, `push`, `req.params`, `req.body`, `res.status`, `perpustakaan`

## 🚫 Larangan

- SEMUA soal: dilarang `app.listen(...)` — akan langsung gagal & dibatalkan
- soal 1: dilarang `app.get`, `app.post`, `app.delete`
- soal 2: dilarang `app.get`, `app.post`, `app.put`, `splice`
- soal 1-3: dilarang `for`, `while`
- mengubah nama variabel/alamat route dari soal
- menggabungkan semua jawaban dalam satu file

---

# 📌 Contoh Hasil Test Berhasil

```bash
npm test
```

```text
================================
Menjalankan semua test Express CRUD Lengkap
================================
...
================================
HASIL AKHIR
================================
✅ Semua test LULUS
```
