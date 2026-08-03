# 📘 Latihan — PostgreSQL Query Dasar

## 📖 Deskripsi

Latihan ini melatih query SQL dasar di PostgreSQL: `CREATE TABLE`,
`INSERT INTO`, `SELECT`, `WHERE`, `ORDER BY`, `LIMIT`, `UPDATE`, dan
`DELETE`. Ini Phase 3 dari
[ROADMAP](../../ic-01/ROADMAP.md) — jembatan sebelum Phase 4
(menghubungkan Express + PostgreSQL pakai package `pg`).

> 📖 Belum familiar dengan materi ini? Baca dulu
> [MATERI.md](MATERI.md) sebelum mulai mengerjakan soal di bawah.

**Beda penting dari modul-modul sebelumnya:** test di modul ini
BENERAN konek ke database PostgreSQL asli di komputer kamu dan
menjalankan query kamu di sana — bukan cuma cek teks kode kayak
`destructuring-spread-async` atau `express-dasar`. Jadi wajib setup
database dulu (lihat bawah) sebelum `npm test`.

---

## 🛠️ Setup Database

1. Pastikan PostgreSQL sudah terpasang dan jalan di komputer kamu.

   **Windows:**
   - Download & jalankan installer dari
     [postgresql.org/download/windows](https://www.postgresql.org/download/windows/)
     (link "Download the installer" → EnterpriseDB).
   - Pas wizard jalan: biarin **Command Line Tools** tetep dicentang
     (itu yang ngasih `psql`/`createdb`), dan **CATET password**
     yang kamu buat buat user `postgres` — bakal dipakai di langkah 4.
   - Servicenya (`postgresql-x64-16`) otomatis jalan sendiri abis
     instalasi, gak perlu perintah start manual.
   - Kalau `psql`/`createdb` gak dikenali di Command Prompt/PowerShell,
     tambahin `C:\Program Files\PostgreSQL\16\bin` ke PATH (Start Menu
     → "Edit environment variables for your account"), lalu buka
     terminal baru.

   **Mac:**
   ```bash
   brew install postgresql@16
   brew services start postgresql@16
   ```
   Tambahin ke PATH kalau `psql` belum kekenal (`~/.zshrc`):
   ```bash
   export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"
   ```

   > Detail lengkap tiap OS + perintah `psql` dasar ada di
   > [MATERI.md](MATERI.md) bagian "Instalasi PostgreSQL".

2. Buat database khusus buat latihan ini:
   ```bash
   createdb -U postgres latihan_postgres_dasar
   ```
   (di Windows bakal diminta password `postgres` yang tadi dicatet).
   Kalau `createdb` gak ketemu, bisa juga lewat `psql`:
   ```bash
   psql -U postgres
   ```
   ```sql
   CREATE DATABASE latihan_postgres_dasar;
   ```
3. Install dependency:
   ```bash
   cd postgres-query-dasar
   npm install
   ```
4. Copy `.env.example` jadi `.env`, lalu sesuaikan `PGPASSWORD` sama
   password `postgres` kamu (di Windows ini **WAJIB** diisi, karena
   passwordnya ditentuin sendiri pas instalasi — beda sama Mac yang
   defaultnya gak perlu password sama sekali):
   ```bash
   cp .env.example .env
   ```
   ```text
   PGHOST=localhost
   PGPORT=5432
   PGUSER=postgres
   PGPASSWORD=ganti_sesuai_password_kamu
   PGDATABASE=latihan_postgres_dasar
   ```

Table yang dipakai latihan (`siswa`) dibuat & diisi OTOMATIS sama
test-nya sendiri sebelum tiap soal dijalankan — kamu gak perlu bikin
manual, kecuali di Soal 1 (`CREATE TABLE`) memang itu yang lagi
dilatih.

---

## 📁 Struktur File

```text
.
├── soal/
│   ├── 01-create-table.sql
│   ├── 02-insert-into.sql
│   ├── 03-select-semua.sql
│   ├── 04-where-filter.sql
│   ├── 05-order-by-limit.sql
│   ├── 06-update-data.sql
│   └── 07-delete-data.sql
├── test/
│   ├── 01-test-create-table.js
│   ├── 02-test-insert-into.js
│   ├── 03-test-select-semua.js
│   ├── 04-test-where-filter.js
│   ├── 05-test-order-by-limit.js
│   ├── 06-test-update-data.js
│   ├── 07-test-delete-data.js
│   ├── db.js
│   ├── fixture.js
│   ├── strip-comments.js
│   └── test-all.js
├── .env.example
└── package.json
```

> Peserta hanya mengerjakan file di folder `soal/`. File di folder
> `test/` tidak perlu diubah.

---

## 🧪 Cara Menjalankan Test

```bash
cd postgres-query-dasar
npm test
```

Atau per soal:

```bash
npm run test:create-table
npm run test:insert-into
npm run test:select-semua
npm run test:where-filter
npm run test:order-by-limit
npm run test:update-data
npm run test:delete-data
```

---

# 🧪 SOAL 1 — CREATE TABLE *(mudah)*

Buat table `siswa` dengan kolom `id` (SERIAL, PRIMARY KEY), `nama`
(VARCHAR(50), NOT NULL), `kelas` (VARCHAR(10)), `nilai` (INTEGER,
DEFAULT 0).

**Dicek:** struktur kolom & constraint-nya beneran ada di database
(bukan cuma teks di file).

---

# 🧪 SOAL 2 — INSERT INTO *(mudah)*

Masukkan 3 baris data siswa (Andi, Budi, Sari) ke table `siswa`.

**Dicek:** table beneran berisi 3 baris dengan nilai yang sesuai
setelah query kamu dijalankan.

---

# 🧪 SOAL 3 — SELECT SEMUA DATA *(mudah)*

Ambil semua kolom & semua baris dari table `siswa`.

**Dicek:** hasil query mengembalikan semua 4 baris data seed dengan
semua kolomnya.

---

# 🧪 SOAL 4 — WHERE (FILTER) *(sedang)*

Ambil kolom `nama` saja, untuk siswa dengan `nilai >= 80`.

**Dicek:** hasil cuma berisi kolom `nama`, isinya persis Andi & Sari.

---

# 🧪 SOAL 5 — ORDER BY & LIMIT *(sedang)*

Ambil 2 siswa dengan nilai tertinggi, urutkan dari yang paling tinggi.

**Dicek:** hasil persis 2 baris, urutannya Andi (90) lalu Sari (88).

---

# 🧪 SOAL 6 — UPDATE *(sedang)*

Ubah nilai milik Budi jadi 95, TANPA mengubah siswa lain.

**Dicek:** nilai Budi berubah jadi 95, nilai Andi/Sari/Rina TETAP
sama seperti semula.

---

# 🧪 SOAL 7 — DELETE *(sulit)*

Hapus baris milik Rina saja, TANPA menghapus siswa lain.

**Dicek:** Rina hilang dari table, Andi/Budi/Sari masih ada semua.

---

## ⚠️ Ketentuan Wajib

- soal 1: `CREATE TABLE`, `SERIAL`, `PRIMARY KEY`, `VARCHAR`, `NOT NULL`, `DEFAULT`
- soal 2: `INSERT INTO`, `siswa`, `VALUES`
- soal 3: `SELECT`, `*`, `siswa`
- soal 4: `SELECT`, `nama`, `siswa`, `WHERE`, `nilai`
- soal 5: `SELECT`, `siswa`, `ORDER BY`, `DESC`, `LIMIT`
- soal 6: `UPDATE`, `siswa`, `SET`, `nilai`, `WHERE`, `Budi`
- soal 7: `DELETE`, `FROM`, `siswa`, `WHERE`, `Rina`

## 🚫 Larangan

- soal 1: `DROP TABLE`, `DROP DATABASE`, `TRUNCATE`
- soal 2: `DROP TABLE`, `DELETE FROM`, `UPDATE`, `TRUNCATE`
- soal 3: `WHERE`, `DROP`, `DELETE`, `UPDATE`, `INSERT`, `TRUNCATE`
- soal 4, 5: `DROP`, `DELETE`, `UPDATE`, `INSERT`, `TRUNCATE`
- soal 6, 7: `DROP`, `INSERT`, `TRUNCATE`, dan **wajib** pakai `WHERE`
  supaya gak ngubah/hapus semua baris sekaligus
- mengganti nama table `siswa`
- menggabungkan semua jawaban dalam satu file

---

# 📌 Contoh Hasil Test Berhasil

```bash
npm test
```

```text
================================
Menjalankan semua test PostgreSQL Query Dasar
================================
...
================================
HASIL AKHIR
================================
✅ Semua test LULUS
```

---

## 🩺 Troubleshooting

- **`❌ Gagal konek ke PostgreSQL`** — cek PostgreSQL sudah jalan
  (`pg_isready` atau buka pgAdmin/TablePlus), database
  `latihan_postgres_dasar` sudah dibuat, dan kredensial di `.env`
  sudah benar.
- **`role "postgres" does not exist`** — user default PostgreSQL kamu
  mungkin beda (misal sama dengan username Mac kamu). Isi
  `PGUSER`/`PGPASSWORD` di `.env` sesuai user PostgreSQL kamu.
