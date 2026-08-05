# 📘 Materi Simpel — Config DB, Migration, Seeding

> 🎯 Ini versi RINGKAS. Sengaja cuma bahas 3 hal ini aja — kalau mau
> yang lebih detail/lengkap, baca `postgres-migration-dasar/MATERI.md`
> abis 3 hal ini beneran nempel duluan.

---

## 🏪 Satu Analogi buat Semuanya: Buka Toko Buku Baru

Bayangin kamu mau buka toko buku baru. Sebelum bisa jualan, ada
**3 langkah wajib, HARUS berurutan**:

```
1️⃣ Sambungin telepon ke gudang     →  CONFIG DB
2️⃣ Bikin rak-rak kosong di gudang  →  MIGRATION
3️⃣ Isi rak-rak itu pakai barang    →  SEEDING
```

Kenapa urutannya gak boleh ketuker?
- Gak bisa bikin rak (2) kalau belum nyambung ke gudangnya (1).
- Gak bisa isi barang ke rak (3) kalau raknya belum ada (2).

Itu aja. Semua kode di bawah cuma ngejalanin 3 langkah ini.

---

## 1️⃣ Config DB — Sambungin Telepon ke Gudang

File: `config/database.js`

```js
const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
});

module.exports = pool;
```

**Penjelasan (3 kalimat doang):**
- `new Pool({...})` = nyambungin ke database.
- Isi sambungannya (host, user, password, dst) diambil dari file
  `.env` — supaya gampang ganti-ganti tanpa ubah kode.
- `module.exports = pool` = file lain tinggal "pinjem" sambungan ini,
  gak perlu nyambung ulang tiap kali.

> 🎤 **Cara ngomonginnya:** *"Ini kayak masangin telepon ke gudang.
> Sekali sambung, semua bagian toko bisa pake telepon yang sama buat
> nelepon gudang — gak perlu masang telepon baru tiap ruangan."*

---

## 2️⃣ Migration — Bikin Rak Kosong di Gudang

File: `db/migrations/001_create_buku.sql`

```sql
CREATE TABLE buku (
  id SERIAL PRIMARY KEY,
  judul VARCHAR(100) NOT NULL,
  penulis VARCHAR(100),
  stok INTEGER DEFAULT 0
);
```

**Penjelasan (3 kalimat doang):**
- Ini bikin RAK baru namanya `buku`, dengan 4 kotak: `id`, `judul`,
  `penulis`, `stok`.
- Rak ini masih KOSONG — belum ada barangnya sama sekali.
- File ini dijalanin OTOMATIS pakai `db/migrate.js` (udah disediain,
  gak usah dipikirin cara kerjanya dulu — cukup tau: "ini yang
  ngejalanin file migration").

> 🎤 **Cara ngomonginnya:** *"CREATE TABLE itu kayak masang rak baru
> di gudang, terus nentuin rak ini punya berapa kotak dan tiap kotak
> buat naruh apa. Belum diisi barang — itu langkah berikutnya."*

---

## 3️⃣ Seeding — Isi Rak dengan Barang Contoh

File: `db/seeders/seed.js`

```js
const pool = require("../../config/database");

async function seed() {
  await pool.query("DELETE FROM buku");

  await pool.query(
    "INSERT INTO buku (judul, penulis, stok) VALUES ($1, $2, $3)",
    ["Laskar Pelangi", "Andrea Hirata", 4]
  );
}

module.exports = seed;
```

**Penjelasan (3 kalimat doang):**
- `DELETE FROM buku` = kosongin dulu raknya (biar aman dijalanin
  berkali-kali, gak numpuk barang dobel).
- `INSERT INTO ...` = taruh 1 barang contoh ke rak (boleh diulang
  buat nambah barang contoh lain).
- Ini yang bikin rak yang tadinya kosong (dari migration) jadi ADA
  ISINYA, siap dicoba/dipamerin.

> 🎤 **Cara ngomonginnya:** *"Kalau migration itu masang rak kosong,
> seed itu ngisi rak itu pake barang contoh — biar pas toko dibuka,
> keliatan ada isinya, gak kosong melompong. Kosongin dulu sebelum
> isi ulang, biar gak dobel-dobel."*

---

## ✅ Ringkasan (1 Kalimat per Konsep)

| Langkah | Satu Kalimat |
|---|---|
| **Config DB** | Nyambungin kode ke database, sekali doang, dipake bareng-bareng. |
| **Migration** | Bikin STRUKTUR tabel (rak kosong). |
| **Seeding** | Isi tabel itu dengan DATA CONTOH (barang di rak). |

---

## 🧠 Cek Paham (Cuma 2 Pertanyaan)

1. *"Kalau migration belum dijalanin, kenapa seeding pasti error?"*
   (jawaban: karena raknya belum ada, jadi gak ada tempat naruh
   barangnya)
2. *"Kenapa seed harus `DELETE` dulu sebelum `INSERT`?"*
   (jawaban: biar gak numpuk dobel kalau dijalanin berkali-kali)

Kalau 2 ini kejawab lancar, baru lanjut ke bagian lain (parameterized
query, CRUD, dst) — JANGAN digabung sekaligus di sesi yang sama.
