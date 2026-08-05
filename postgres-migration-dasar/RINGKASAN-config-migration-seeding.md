# Ringkasan — .env, Config DB, Migration, & Seeding

> Versi ringkas, fokus 4 topik ini doang. Gak pakai analogi — langsung
> kode + penjelasan per baris. Pendamping slide
> `config-migration-seeding-ringkas.pptx`.

---

## 0. File .env

### Apa itu

- File teks biasa, isinya daftar pengaturan.
- Formatnya: `NAMA=nilai`, satu baris satu pengaturan.
- Letaknya di folder utama project, nama file-nya persis `.env`
  (diawali titik, tanpa nama lain).

Contoh isi file `.env`:
```text
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=postgres
PGDATABASE=perpustakaan_mini
```

### Kenapa pengaturan dipisah dari kode

1. **Password tiap komputer beda.** Password kamu, password murid,
   password server nanti — semuanya beda. Kalau ditulis di kode,
   tiap komputer harus ubah kode-nya sendiri.
2. **Kode boleh dibagikan, password tidak.** Kode di-upload ke
   GitHub biar bisa dipakai bareng. Password harus tetap rahasia —
   kalau ikut ke kode, semua orang yang lihat GitHub jadi tau
   password-nya.

### Cara kerjanya di kode

```js
require("dotenv").config();

// habis baris di atas jalan:
process.env.PGHOST       // -> "localhost"
process.env.PGPASSWORD   // -> "postgres"
```

- `dotenv` adalah package yang tugasnya baca file `.env`.
- `require("dotenv").config()` — baca isi file `.env`, masukin
  nilainya ke `process.env`.
- Setelah baris itu jalan, `process.env.PGHOST` otomatis berisi
  nilai dari baris `PGHOST=...` di file `.env`.
- **Urutan wajib:** `require("dotenv").config()` harus dipanggil
  PALING ATAS, sebelum file lain yang butuh `process.env` (misalnya
  `config/database.js`) di-require.

### Dua file berbeda

| File | Isinya | Boleh di-commit ke git? |
|---|---|---|
| `.env.example` | Contoh/template. Isinya boleh nilai dummy. | Boleh — aman |
| `.env` | Isi ASLI di komputer kamu — password beneran. | TIDAK — wajib `.gitignore` |

**Kalau `.env` ke-commit ke git:** semua orang yang bisa lihat repo
GitHub-nya jadi tau password database kamu. Cara amannya: pastikan
`.env` ada di file `.gitignore` SEBELUM pertama kali commit.

---

## 1. Config DB

File yang menyimpan pengaturan koneksi ke database.

```js
// config/database.js
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

**Isi file ini:**
- `require("pg")` — ambil tool buat connect ke PostgreSQL.
- `new Pool({...})` — bikin satu koneksi ke database.
- Nilai `host`/`user`/`password` diambil dari `process.env`, artinya
  dari file `.env` — bukan ditulis manual di kode.
- `module.exports = pool` — file lain tinggal `require` file ini
  buat pakai koneksi yang sama.

**Kenapa pengaturan ditulis di file `.env`, bukan di kode:**
1. Password tiap komputer beda (punya kamu, punya murid, punya
   server nanti) — kalau ditulis di kode, tiap komputer harus ubah
   kode-nya sendiri.
2. Kode di-upload ke GitHub biar bisa dipakai bareng. Password harus
   tetap rahasia — kalau ikut ke kode, semua orang yang lihat GitHub
   jadi tau password-nya.

---

## 2. Migration

File `.sql` yang isinya perintah membuat atau mengubah struktur tabel.

- Dikasih nomor di depan nama file (`001_...`, `002_...`) supaya
  urutan jalannya jelas.
- Dijalankan pakai satu script (`migrate.js`), bukan diketik manual
  satu-satu ke database.

**Cara kerjanya:**
1. Bikin file `.sql`, isinya `CREATE TABLE ...`
2. Jalankan script `migrate.js`
3. Script cek: file ini sudah pernah dijalankan belum?
4. Kalau belum, jalankan lalu catat di tabel `schema_migrations`

**Contoh file migration** (`db/migrations/001_create_buku.sql`):
```sql
CREATE TABLE buku (
  id SERIAL PRIMARY KEY,
  judul VARCHAR(100) NOT NULL,
  penulis VARCHAR(100),
  stok INTEGER DEFAULT 0
);
```
- `id SERIAL PRIMARY KEY` — nomor urut otomatis, jadi identitas tiap
  baris.
- `NOT NULL` — kolom ini wajib diisi.
- `DEFAULT 0` — kalau tidak diisi, otomatis bernilai 0.

**Bagian inti runner** (`db/migrate.js`):
```js
for (const file of files) {
  if (sudahJalan.has(file)) continue;
  const sql = fs.readFileSync(file);
  await pool.query(sql);
}
```
- Runner membaca semua file `.sql`, urut dari nomor terkecil.
- File yang sudah pernah dijalankan (`sudahJalan.has(file)`)
  di-skip — supaya aman dijalankan berkali-kali.

---

## 3. Seeding

Script yang mengisi tabel dengan data contoh.

- Beda dari migration: migration mengatur **struktur** tabel,
  seeding mengisi **isi/data**-nya.
- Data lama dihapus dulu sebelum diisi ulang, supaya datanya tidak
  menumpuk kalau script ini dijalankan berkali-kali.

```js
// db/seeders/seed.js
async function seed() {
  await pool.query("DELETE FROM buku");
  const daftarBuku = [
    { judul: "Laskar Pelangi", stok: 4 },
    { judul: "Bumi Manusia", stok: 2 },
  ];
  for (const buku of daftarBuku) {
    await pool.query(
      "INSERT INTO buku (judul, stok) VALUES ($1, $2)",
      [buku.judul, buku.stok]
    );
  }
}
```

**Baris per baris:**
- `DELETE FROM buku` — kosongkan dulu tabelnya.
- `daftarBuku` — daftar data contoh, ditulis sebagai array.
- `for (const buku of daftarBuku)` — ulangi proses insert untuk
  tiap data di daftar.
- `$1, $2` — tempat nilai `judul` dan `stok` dimasukkan. Nilainya
  diambil dari array `[buku.judul, buku.stok]` di baris bawahnya.

---

## Ringkasan

| Bagian | Fungsinya |
|---|---|
| `.env` | File pengaturan koneksi (password, host, dll), tidak ikut di-commit ke git |
| Config DB | File yang menyimpan pengaturan koneksi ke database (`config/database.js`) |
| Migration | File `.sql` bernomor yang membuat/mengubah struktur tabel, dijalankan lewat script |
| Seeding | Script yang mengisi tabel dengan data contoh, hapus dulu baru isi ulang |

Urutan jalannya selalu sama: **`.env`** diisi dulu → **Config DB**
baca `.env` → **Migration** membuat tabel → **Seeding** mengisi
datanya.

---

## Cek Paham

1. Kenapa password database ditulis di file `.env`, bukan di kode?
2. File config db isinya apa?
3. Kenapa migration ditulis di file, bukan diketik langsung ke
   database?
4. Kenapa seeding harus `DELETE` data lama dulu sebelum insert data
   baru?

Kalau 4 ini sudah bisa dijawab, lanjut coba langsung di project
(`project-perpustakaan-mini/start/`).
