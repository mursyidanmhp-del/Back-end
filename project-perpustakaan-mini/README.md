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

---

## 📁 Dua Folder

- **`start/`** — folder yang dikerjain murid. Struktur file udah
  disiapin, tinggal isi bagian yang ada `// TODO`.
- **`end/`** — contoh hasil jadi yang BENERAN jalan. Dipakai buat:
  1. Ngecek jawaban murid (compare struktur & pendekatan)
  2. Kalau murid beneran kejebak lama, boleh diliat SEBAGIAN (jangan
     langsung kasih semua)

> ⚠️ Kedua folder pakai database yang SAMA (`perpustakaan_mini`).
> Kalau mau jalanin `end/` buat ngecek referensi TANPA ganggu progress
> murid di `start/`, pisahin dulu — ganti `PGDATABASE` di salah satu
> `.env` (misal `perpustakaan_mini_referensi`), atau jalanin gantian
> aja (gak masalah dipakai gantian, karena migration/seed selalu
> reset datanya).

---

## 📁 Struktur Folder (di dalam `start/` maupun `end/`)

```text
.
├── config/
│   └── database.js       (connection pool — dulu namanya db.js)
├── db/
│   ├── migrate.js         (runner migration — DISEDIAKAN, sama kayak modul sebelumnya)
│   ├── migrations/
│   │   └── 001_create_buku.sql
│   └── seeders/
│       └── seed.js
├── queries/
│   ├── tambahBuku.js
│   ├── lihatSemuaBuku.js
│   ├── cariBuku.js
│   ├── updateStokBuku.js
│   └── hapusBuku.js
├── index.js
├── buat-db.js
├── cek-koneksi.js
├── .env.example
└── package.json
```

`config/` isinya pengaturan koneksi, `db/` isinya semua hal yang
berhubungan langsung sama database (struktur & data contoh). Ini
sengaja dipisah dari sekarang — begitu masuk arsitektur **MVC**
nanti, `controllers/`, `models/`, dan `routes/` bakal nempel di
samping struktur ini, dan `config/`+`db/` udah gak perlu diubah lagi.

---

## 🛠️ Setup (di folder `start/`, ulangin sama di `end/` kalau perlu)

```bash
cd start
npm install
cp .env.example .env      # sesuaikan PGPASSWORD kalau perlu
npm run buat-db
npm run cek-koneksi
```

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
9. **`index.js`** — gabungin semuanya jadi satu alur demo (urutannya
   udah ada di file, tinggal isi TODO-nya):
   1. Jalanin migration
   2. Jalanin seed
   3. Tampilin semua buku
   4. Tambah 1 buku baru, tampilin hasilnya
   5. Cari buku pakai kata kunci, tampilin hasilnya
   6. Update stok buku yang baru ditambah
   7. Hapus salah satu buku SEED (bukan yang baru ditambah)
   8. Tampilin semua buku lagi (buat lihat hasil akhir)

## 🧪 Cara Ngecek Beres atau Belum

```bash
node index.js
```

Gak ada `npm test` otomatis di project ini (beda sama modul
sebelumnya) — cara ngeceknya BACA output di terminal, samain sama
alur di atas: jumlah buku nambah pas soal 4, muncul hasil pencarian
yang bener pas soal 6, stok berubah pas soal 7, jumlah buku berkurang
1 pas soal 8, dan gak ada error MERAH di tengah jalan.

Boleh juga dicek langsung ke database-nya:

```bash
psql -U postgres -d perpustakaan_mini -c "SELECT * FROM buku;"
```

---

## 🔜 Lanjutan

Project ini masih murni Node.js + `pg`, belum ada Express/HTTP sama
sekali — sengaja, biar fokus ke database dulu. Langkah berikutnya
(Phase 4 ROADMAP) bakal bungkus fungsi-fungsi di `queries/` ini jadi
endpoint REST API beneran.
