# 📘 Latihan — db.js, Parameterized Query, & Migration Dasar

## 📖 Deskripsi

Latihan ini melatih 3 hal yang bakal dipakai TERUS mulai Phase 4
ROADMAP ("Menghubungkan Express + PostgreSQL"): bikin **connection
pool** (`db.js`) buat ngobrol ke database dari kode JavaScript, cara
kirim data AMAN pakai **parameterized query** (cegah SQL Injection),
dan cara ngatur perubahan struktur database pakai **migration**
(file `.sql` bernomor + runner sendiri, gak pakai library luar).

> 📖 Belum familiar dengan materi ini? Baca dulu
> [MATERI.md](MATERI.md) sebelum mulai mengerjakan soal di bawah.

Sama kayak [`postgres-query-dasar`](../postgres-query-dasar): test di
modul ini BENERAN konek ke database PostgreSQL asli dan menjalankan
kode/query kamu di sana.

---

## 🛠️ Setup Database

1. Pastikan PostgreSQL sudah terpasang dan jalan di komputer kamu.

   **Windows:**
   - Installer dari [postgresql.org/download/windows](https://www.postgresql.org/download/windows/),
     biarin Command Line Tools tercentang, **catet password** user
     `postgres` pas wizard jalan. Service-nya otomatis nyala sendiri.

   **Mac:**
   ```bash
   brew install postgresql@16
   brew services start postgresql@16
   ```

   > Detail lengkap tiap OS ada di [MATERI.md](MATERI.md) modul
   > `postgres-query-dasar`.

2. Install dependency:
   ```bash
   cd postgres-migration-dasar
   npm install
   ```
3. Copy `.env.example` jadi `.env`, sesuaikan `PGPASSWORD` sama
   password `postgres` kamu:
   ```bash
   cp .env.example .env
   ```
4. Bikin database-nya (otomatis, gak perlu ketik `createdb` manual):
   ```bash
   npm run buat-db
   ```
5. Pastiin semuanya konek dengan benar:
   ```bash
   npm run cek-koneksi
   ```

---

## 📁 Struktur File

```text
.
├── soal/
│   ├── 01-db.js
│   ├── 02-migration-buat-tabel.sql
│   ├── 03-migration-tambah-kolom.sql
│   └── 04-query-berparameter.js
├── test/
│   ├── 01-test-db.js
│   ├── 02-test-migration-buat-tabel.js
│   ├── 03-test-migration-tambah-kolom.js
│   ├── 04-test-query-berparameter.js
│   ├── db.js            (pool milik grader, terpisah dari punya soal 1)
│   ├── fixture.js
│   ├── migrate.js        (runner migration — baca ini, isinya juga ada di MATERI.md)
│   ├── strip-comments.js
│   ├── buat-db.js
│   ├── cek-koneksi.js
│   └── test-all.js
├── .env.example
└── package.json
```

> Peserta hanya mengerjakan file di folder `soal/`. File di folder
> `test/` tidak perlu diubah — tapi `test/migrate.js` (runner
> migration) sengaja BOLEH dibaca, isinya persis yang dijelasin di
> MATERI.md.

---

## 🧪 Cara Menjalankan Test

```bash
npm test
```

Atau per soal:

```bash
npm run test:db
npm run test:migration-buat-tabel
npm run test:migration-tambah-kolom
npm run test:query-berparameter
```

---

# 🧪 SOAL 1 — db.js: CONNECTION POOL *(mudah)*

Bikin `Pool` dari `pg`, config dari `process.env`, `module.exports`
sebuah pool yang siap dipakai file lain.

**Dicek:** file-nya beneran bisa di-require dan `pool.query("SELECT
1")` beneran jalan ke database asli.

---

# 🧪 SOAL 2 — MIGRATION: BUAT TABEL *(mudah)*

Migration pertama: `CREATE TABLE buku` (id, judul, penulis).

**Dicek:** dijalanin lewat runner (`test/migrate.js`), struktur
kolomnya diperiksa dari database asli, dan tercatat di
`schema_migrations`.

---

# 🧪 SOAL 3 — MIGRATION: TAMBAH KOLOM *(sedang)*

Migration kedua: `ALTER TABLE buku ADD COLUMN stok`. Dijalanin
SETELAH migration soal 2 (versi referensi, bukan jawaban kamu sendiri)
lewat runner yang sama.

**Dicek:** kolom lama (id, judul, penulis) tetep utuh, kolom `stok`
baru sesuai spek, dan KEDUA migration tercatat berurutan.

---

# 🧪 SOAL 4 — QUERY BERPARAMETER *(sulit)*

`tambahBuku(judul, penulis)` yang INSERT ke tabel `buku` pakai db.js
dari soal 1, WAJIB pakai placeholder `$1`/`$2`.

**Dicek:** data beneran kesimpen, return value bener, DAN dicoba
kirim data yang isinya tanda kutip (`'`) — kalau placeholder-nya
beneran dipakai, ini harus tetep aman (bukti nyata perlindungan dari
SQL Injection).

---

## ⚠️ Ketentuan Wajib

- soal 1: `require("pg")`, `new Pool`, `process.env.PGHOST/PGUSER/PGPASSWORD/PGDATABASE`, `module.exports`
- soal 2: `CREATE TABLE`, `SERIAL`, `PRIMARY KEY`, `VARCHAR`, `NOT NULL`
- soal 3: `ALTER TABLE`, `buku`, `ADD COLUMN`, `stok`, `INTEGER`, `DEFAULT`
- soal 4: `require("./01-db")`, `async function tambahBuku`, `$1`, `$2`, `RETURNING *`, `module.exports`

## 🚫 Larangan

- soal 1: `new Client` (harus `Pool`)
- soal 2: `DROP TABLE`, `DROP DATABASE`, `TRUNCATE`, `ALTER TABLE`
- soal 3: `CREATE TABLE`, `DROP TABLE`, `DROP DATABASE`, `TRUNCATE`
- soal 4: backtick (`` ` ``) di query, nyambung teks query pakai `+`
  — WAJIB placeholder `$1`/`$2`
- mengganti nama tabel `buku` atau nama file `01-db.js`
- menggabungkan semua jawaban dalam satu file

---

# 📌 Contoh Hasil Test Berhasil

```bash
npm test
```

```text
================================
Menjalankan semua test db.js & Migration Dasar
================================
...
================================
HASIL AKHIR
================================
✅ Semua test LULUS
```

---

## 🩺 Troubleshooting

Sama kayak modul `postgres-query-dasar` — jalankan
`npm run cek-koneksi` buat diagnosa persis di tahap mana yang gagal
(server belum nyala / database belum ada / salah password).
