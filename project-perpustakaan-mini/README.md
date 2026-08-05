# 📘 Project — Perpustakaan Mini

## 🎯 Tujuan

Ini BUKAN latihan satu-konsep kayak `postgres-query-dasar` atau
`postgres-migration-dasar` — ini **project gabungan**. Semua yang udah
dipelajari di dua modul itu dipakai BARENGAN buat bikin satu sistem
kecil yang beneran jalan: data buku perpustakaan, lengkap dari bikin
struktur database sampai CRUD (Create, Read, Update, Delete).

Gak ada konsep baru di sini. Kalau kejebak, itu tandanya salah satu
materi sebelumnya (`db.js`, migration, seed, parameterized query,
`WHERE`/`UPDATE`/`DELETE`) masih perlu diulang — bukan tanda project
ini butuh hal baru yang belum diajarin.

**Folder `start/` sengaja KOSONG.** Bedanya sama modul-modul
sebelumnya: kali ini kamu bikin sendiri semua file & foldernya dari
nol, gak disediain kerangka TODO. Panduan di bawah ini didesain biar
kamu bisa jalan SENDIRIAN — baca pelan-pelan, ikutin urut, jangan
skip bagian yang kelihatannya "keknya udah tau".

---

## 🧰 Yang Harus Sudah Ter-install

Cek satu-satu di terminal SEBELUM mulai. Kalau salah satu belum ada,
install dulu, baru lanjut.

| # | Yang dicek | Command cek | Hasil yang diharapkan |
|---|---|---|---|
| 1 | Node.js | `node -v` | Muncul versi, misal `v20.11.0` (bukan "command not found") |
| 2 | npm (ikut ke-install bareng Node.js) | `npm -v` | Muncul versi, misal `10.2.4` |
| 3 | PostgreSQL server | `psql --version` | Muncul versi, misal `psql (PostgreSQL) 16.x` |
| 4 | PostgreSQL server nyala | `pg_isready` | `accepting connections` |

### Kalau Node.js/npm belum ada

Harusnya udah ke-install dari Phase 1 (Node.js Fundamentals). Kalau
beneran belum: download installer LTS dari
[nodejs.org](https://nodejs.org), install, buka terminal BARU, cek
ulang `node -v`.

### Kalau PostgreSQL belum ada / `pg_isready` gagal

Ini persis proses yang udah dilakuin di modul `postgres-query-dasar`
dan `postgres-migration-dasar` — kalau modul itu udah pernah beres
dikerjain, PostgreSQL harusnya UDAH nyala. Kalau belum:

- **Windows:** installer dari
  [postgresql.org/download/windows](https://www.postgresql.org/download/windows/),
  centang Command Line Tools, catet password user `postgres`.
  Service-nya otomatis nyala sendiri abis instalasi.
- **Mac:** `brew install postgresql@16` lalu `brew services start postgresql@16`.

> Detail troubleshooting lengkap ada di `MATERI.md` modul
> `postgres-migration-dasar`, bagian "Instalasi PostgreSQL".

### Package `pg` dan `dotenv`

Ini **BUKAN** software yang di-download terpisah — ini **package
npm**, di-install lewat `npm install` SETELAH `package.json` dibikin
(langkah ini ada di bagian "Bikin Struktur Folder" di bawah). Jangan
cari installer buat `pg`/`dotenv`, gak ada — cukup lewat npm.

---

## 📁 Dua Folder

- **`start/`** — folder yang kamu kerjain. **KOSONG total**, kamu
  bikin semua file & foldernya sendiri (panduan lengkap di bawah).
- **`end/`** — contoh hasil jadi yang BENERAN jalan. Dipakai buat:
  1. Nyalin file INFRASTRUKTUR (bukan bagian yang dipelajari — lihat
     penjelasan di langkah 3 bawah)
  2. Ngecek jawaban kamu (bandingin struktur & pendekatan) SETELAH
     kamu coba sendiri dulu
  3. Kalau beneran kejebak lama, boleh diliat SEBAGIAN (jangan
     langsung nyontek semua)

> ⚠️ Kedua folder pakai database yang SAMA (`perpustakaan_mini`).
> Kalau mau jalanin `end/` buat ngecek referensi TANPA ganggu progress
> kamu di `start/`, pisahin dulu — ganti `PGDATABASE` di salah satu
> `.env` (misal `perpustakaan_mini_referensi`), atau jalanin gantian
> aja (gak masalah dipakai gantian, karena migration/seed selalu
> reset datanya).

---

## 🎯 Struktur Folder — Target Akhir

Ini struktur yang mau dicapai di akhir. Bikin bertahap ngikutin
langkah di bagian selanjutnya, JANGAN coba bikin semua sekaligus.

```text
start/
├── config/
│   └── database.js       ← kamu tulis (Tugas 1)
├── db/
│   ├── migrate.js         ← disalin dari end/ (infrastruktur)
│   ├── migrations/
│   │   └── 001_create_buku.sql   ← kamu tulis (Tugas 2)
│   └── seeders/
│       └── seed.js        ← kamu tulis (Tugas 3)
├── queries/
│   ├── tambahBuku.js      ← kamu tulis (Tugas 4)
│   ├── lihatSemuaBuku.js  ← kamu tulis (Tugas 5)
│   ├── cariBuku.js        ← kamu tulis (Tugas 6)
│   ├── updateStokBuku.js  ← kamu tulis (Tugas 7)
│   └── hapusBuku.js       ← kamu tulis (Tugas 8)
├── index.js               ← kamu tulis (Tugas 9)
├── buat-db.js             ← disalin dari end/ (infrastruktur)
├── cek-koneksi.js         ← disalin dari end/ (infrastruktur)
├── .env.example           ← kamu tulis
├── .env                   ← kamu bikin dari .env.example (JANGAN di-commit ke git)
└── package.json           ← dibikin otomatis oleh npm init
```

`config/` isinya pengaturan koneksi, `db/` isinya semua hal yang
berhubungan langsung sama database (struktur & data contoh). Ini
sengaja dipisah dari sekarang — begitu masuk arsitektur **MVC**
nanti, `controllers/`, `models/`, dan `routes/` bakal nempel di
samping struktur ini, dan `config/`+`db/` udah gak perlu diubah lagi.

**"Kamu tulis" vs "disalin dari `end/`":** 3 file (`db/migrate.js`,
`buat-db.js`, `cek-koneksi.js`) itu **infrastruktur/tooling**, sama
persis kayak di modul `postgres-migration-dasar` — bukan bagian yang
lagi dipelajari, jadi WAJAR & BOLEH langsung disalin dari `end/`. Sisanya
(9 file bertanda "Tugas") itu yang harus kamu tulis sendiri.

---

## 🏗️ Bikin Struktur Folder dari Nol

Kerjain URUT dari langkah 1. Jalankan tiap command dari DALAM folder
`start/` (pastikan posisi terminal kamu di situ — cek pakai `pwd`
di Mac/Linux atau `cd` tanpa argumen di Windows buat lihat folder
aktif).

### Langkah 1 — Inisialisasi project Node.js

```bash
npm init -y
```

Ini bikin file `package.json` otomatis (isinya masih default/kosong,
nanti diedit dikit di Langkah 4).

### Langkah 2 — Install dependency

```bash
npm install pg dotenv
```

Ini yang bikin package `pg` (buat connect ke PostgreSQL) dan `dotenv`
(buat baca file `.env`) beneran ke-download ke folder `node_modules/`
dan tercatat di `package.json`.

### Langkah 3 — Bikin semua folder

**Mac / Linux / Git Bash:**
```bash
mkdir -p config db/migrations db/seeders queries
```

**Windows (Command Prompt biasa):**
```bat
mkdir config
mkdir db
mkdir db\migrations
mkdir db\seeders
mkdir queries
```

Cek hasilnya — harus ada 5 folder: `config`, `db`, `db/migrations`,
`db/seeders`, `queries`.

### Langkah 4 — Bikin file-file kosong

Paling gampang lewat VS Code: klik kanan nama folder di panel
Explorer sebelah kiri → **New File** → ketik nama file-nya (termasuk
folder di depannya kalau perlu, misal `queries/tambahBuku.js`).

Bikin file-file ini (masih KOSONG dulu, isinya nanti di langkah
setelah ini):

- `config/database.js`
- `db/migrations/001_create_buku.sql`
- `db/seeders/seed.js`
- `queries/tambahBuku.js`
- `queries/lihatSemuaBuku.js`
- `queries/cariBuku.js`
- `queries/updateStokBuku.js`
- `queries/hapusBuku.js`
- `index.js`
- `.env.example`

### Langkah 5 — Salin 3 file infrastruktur dari `end/`

Buka `../end/db/migrate.js`, `../end/buat-db.js`, dan
`../end/cek-koneksi.js` — copy-paste ISINYA persis ke file yang sama
posisinya di `start/` (bikin dulu file kosongnya kayak langkah 4:
`db/migrate.js`, `buat-db.js`, `cek-koneksi.js`).

> Kenapa boleh disalin langsung? Karena ini TOOLING (runner
> migration, script setup database) — bukan konsep yang lagi
> diajarin di project ini. Fokus belajar kamu ada di 9 file bertanda
> "Tugas" di tabel struktur folder di atas.

### Langkah 6 — Tambahin `scripts` di `package.json`

Buka `package.json` (hasil Langkah 1), tambahin bagian `"scripts"`
supaya isinya kayak gini:

```json
{
  "name": "start",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "buat-db": "node buat-db.js",
    "cek-koneksi": "node cek-koneksi.js"
  },
  "dependencies": {
    "dotenv": "^16.4.5",
    "pg": "^8.11.5"
  }
}
```

(Bagian `dependencies` udah otomatis keisi dari Langkah 2 — versi
persisnya boleh beda dikit, gak masalah.)

### Langkah 7 — Isi `.env.example` dan `.env`

Isi `config/database.js`... eh maksudnya isi `.env.example` dulu:

```text
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=postgres
PGDATABASE=perpustakaan_mini
```

Terus bikin `.env` (file BARU, bukan edit `.env.example`) isinya
SAMA, tapi `PGPASSWORD` disesuain sama password PostgreSQL kamu yang
beneran (kalau di Windows, ini WAJIB diganti sesuai password pas
instalasi — lihat `MATERI.md` `postgres-migration-dasar` kalau lupa
kenapa).

**Penting:** `.env` JANGAN ikut di-commit ke git (isinya password
asli). Kalau project ini nanti di-`git init`, pastikan ada
`.gitignore` isinya minimal `node_modules/` dan `.env`.

---

## ✅ Cek Struktur Sebelum Lanjut

Sebelum mulai isi logic-nya, jalankan ini buat mastiin foldernya
udah bener:

```bash
npm run cek-koneksi
```

Errornya WAJAR di titik ini kalau database `perpustakaan_mini` belum
dibikin — lanjut ke bagian Setup Database di bawah dulu.

---

## 🛠️ Setup Database

```bash
npm run buat-db
npm run cek-koneksi
```

Kalau `cek-koneksi` sampai `✅ SEMUA BERES`, folder & database kamu
udah siap — lanjut ke Tugas Checklist.

---

## ✅ Tugas — Checklist

Kerjain BERURUTAN, karena tiap bagian butuh bagian sebelumnya:

1. **`config/database.js`** — connection pool. Sama persis polanya
   kayak soal 1 di `postgres-migration-dasar`.
2. **`db/migrations/001_create_buku.sql`** — bikin tabel `buku`:
   - `id` — SERIAL, PRIMARY KEY
   - `judul` — VARCHAR(100), NOT NULL
   - `penulis` — VARCHAR(100)
   - `tahun_terbit` — INTEGER
   - `stok` — INTEGER, DEFAULT 0
3. **`db/seeders/seed.js`** — isi 3 buku contoh (bebas judul/penulis
   apa aja, asal lengkap semua kolom). Jangan lupa `DELETE` dulu.
4. **`queries/tambahBuku.js`** — `tambahBuku(judul, penulis, tahunTerbit, stok)`
   → INSERT, `RETURNING *`, balikin baris yang baru dibikin.
5. **`queries/lihatSemuaBuku.js`** — `lihatSemuaBuku()` → SELECT semua
   buku, urutin berdasarkan `id`.
6. **`queries/cariBuku.js`** — `cariBuku(kataKunci)` → SELECT buku yang
   `judul`-nya MENGANDUNG `kataKunci` (pakai `ILIKE` +
   `%` di kode JS, BUKAN ditulis manual di query — placeholder tetep
   `$1`).
7. **`queries/updateStokBuku.js`** — `updateStokBuku(id, stokBaru)` →
   UPDATE kolom `stok`, WAJIB `WHERE id = $...`.
8. **`queries/hapusBuku.js`** — `hapusBuku(id)` → DELETE, WAJIB
   `WHERE id = $...`.
9. **`index.js`** — gabungin semuanya jadi satu alur demo:
   1. `require("dotenv").config();` paling atas
   2. Jalanin migration
   3. Jalanin seed
   4. Tampilin semua buku
   5. Tambah 1 buku baru, tampilin hasilnya
   6. Cari buku pakai kata kunci, tampilin hasilnya
   7. Update stok buku yang baru ditambah
   8. Hapus salah satu buku SEED (bukan yang baru ditambah)
   9. Tampilin semua buku lagi (buat lihat hasil akhir)
   10. `pool.end();` paling akhir

## 🧪 Cara Ngecek Beres atau Belum

```bash
npm start
```

Gak ada `npm test` otomatis di project ini (beda sama modul
sebelumnya) — cara ngeceknya BACA output di terminal, samain sama
alur di atas: jumlah buku nambah pas tugas 4, muncul hasil pencarian
yang bener pas tugas 6, stok berubah pas tugas 7, jumlah buku
berkurang 1 pas tugas 8, dan gak ada error MERAH di tengah jalan.

Boleh juga dicek langsung ke database-nya:

```bash
psql -U postgres -d perpustakaan_mini -c "SELECT * FROM buku;"
```

---

## 🆘 Kejebak? Cek Urutan Ini Dulu

1. `npm run cek-koneksi` — kalau ini gagal, masalahnya di database
   bukan di kode kamu. Baca pesan errornya, biasanya udah nunjukin
   persis apa yang salah.
2. Baca lagi error MERAH di terminal dari ATAS ke BAWAH — baris
   paling atas biasanya nunjukin file & baris berapa masalahnya.
3. Bandingin struktur folder kamu sama tabel target di atas — ada
   yang typo nama file/folder?
4. Buka file yang sama di `end/` — coba PAHAMI dulu pendekatannya
   (baca komentarnya), baru balik ke `start/` dan coba lagi sendiri.
   Jangan langsung copy-paste.

---

## 🔜 Lanjutan

Project ini masih murni Node.js + `pg`, belum ada Express/HTTP sama
sekali — sengaja, biar fokus ke database dulu. Langkah berikutnya
(Phase 4 ROADMAP) bakal bungkus fungsi-fungsi di `queries/` ini jadi
endpoint REST API beneran.
