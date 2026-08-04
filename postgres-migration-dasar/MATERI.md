# 📘 Materi — db.js, Parameterized Query, & Migration

> 🎯 **Materi ini didesain biar kamu (pengajar) bisa langsung ngajarin
> cuma dengan SEKALI baca.** Tiap bagian ada skrip "cara ngomonginnya"
> ke murid — tinggal ikutin alurnya.

Baca ini dulu sebelum mengajar / mengerjakan latihan.

Ini jembatan dari [`postgres-query-dasar`](../postgres-query-dasar) ke
Phase 4 ROADMAP ("Menghubungkan Express + PostgreSQL"). Di modul
sebelumnya, murid nulis SQL langsung di `psql`/`pgAdmin`. Modul ini
ngajarin cara kode JavaScript **ngomong ke database**, dan cara ngatur
**perubahan struktur database** secara rapi & terlacak — dua hal yang
bakal dipakai TERUS mulai Phase 4 dan seterusnya.

---

## 🎬 Buka dengan Analogi Ini

Di modul kemarin, tiap mau nanya ke database, murid buka `psql`
manual, connect, ketik query, tutup. Itu kayak **nelepon kantor lewat
telepon umum tiap kali ada perlu** — jalan, tapi gak praktis kalau
yang butuh nelepon itu APLIKASI yang harus ngelayanin BANYAK orang
sekaligus.

**`db.js`** itu kayak **bikin sambungan telepon PERMANEN ke kantor**,
yang siap dipakai ngobrol dari kode kapan aja tanpa connect ulang tiap
kali.

**Migration** itu beda soal lagi: kalau `CREATE TABLE` kemarin
kejadian SEKALI doang, di project beneran struktur tabel itu TERUS
berubah seiring waktu (nambah kolom, bikin tabel baru). Migration itu
kayak **buku catatan renovasi rak arsip** — tiap kali raknya diubah,
dicatet: kapan, apa yang diubah, urutannya gimana. Jadi siapa pun yang
buka project ini (termasuk laptop lain, server production) bisa
"muterin ulang" semua perubahan itu dan dapet struktur database yang
SAMA PERSIS.

> 🎤 **Cara buka sesi:** *"Kemarin kamu udah bisa ngobrol ke database
> lewat `psql` manual. Sekarang kita bikin KODE-nya yang ngobrol ke
> database — dan kita bikin sistem biar perubahan struktur tabel gak
> cuma nempel di laptop kamu doang, tapi TERCATAT dan bisa
>'dijalanin ulang' di komputer lain."*

---

## 1️⃣ `db.js` — Connection Pool

```js
// db.js
const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.PGHOST || "localhost",
  port: Number(process.env.PGPORT) || 5432,
  user: process.env.PGUSER || "postgres",
  password: process.env.PGPASSWORD || "postgres",
  database: process.env.PGDATABASE || "nama_database",
});

module.exports = pool;
```

- `new Pool({...})` — bikin **kolam koneksi**, bukan cuma satu
  sambungan. Waktu aplikasi butuh query, dia PINJEM satu koneksi dari
  kolam ini, pakai, terus BALIKIN lagi ke kolam — otomatis diatur sama
  library `pg`.
- Config-nya (`host`, `user`, `password`, dst) diambil dari
  `process.env`, BUKAN ditulis langsung di kode — biar gampang beda
  setting antara laptop kamu, laptop murid, dan server nanti (ini
  praktik yang bakal dipakai TERUS sampai deploy).
- `module.exports = pool;` — file lain tinggal
  `const pool = require("./db")`, terus `pool.query(...)`.

### `Pool` vs `Client` — Kenapa Bukan Connect Satu-Satu?

`pg` punya dua cara connect: `Client` (satu sambungan doang) dan
`Pool` (banyak sambungan, dikelola otomatis).

> 🎤 **Cara ngomonginnya:** *"`Client` itu kayak PUNYA SATU LOKET —
> kalau ada 5 orang butuh dilayani bersamaan, 4 di antaranya harus
> ANTRE. `Pool` itu kayak punya BEBERAPA LOKET sekaligus, otomatis
> dibagi-bagi. Aplikasi web itu ngelayanin BANYAK user bersamaan, jadi
> dari awal kita biasain pakai `Pool`, bukan `Client` satu-satu."*

---

## 2️⃣ Parameterized Query — Cara AMAN Kirim Data dari Luar

```js
// SALAH — BAHAYA (SQL Injection):
await pool.query(`SELECT * FROM siswa WHERE nama = '${namaInput}'`);

// BENAR — pakai placeholder $1, $2, dst:
await pool.query("SELECT * FROM siswa WHERE nama = $1", [namaInput]);
```

- Placeholder `$1`, `$2`, ... itu "titik kosong" di query, diisi dari
  ARRAY kedua yang dikasih ke `pool.query(text, [nilai1, nilai2])`.
  `pg` yang ngurus escaping-nya, bukan kamu manual nyambung teks.
- Kalau `namaInput` itu dari input USER (misal lewat form React
  nanti), dan kamu nyambung teks pakai template literal langsung
  (`${namaInput}`), orang jahat bisa ngetik nama yang isinya PERINTAH
  SQL tambahan — ini yang namanya **SQL Injection**, salah satu bug
  keamanan paling umum & paling berbahaya.

> ⚠️ **Ini bukan soal gaya nulis kode, ini soal KEAMANAN.** Placeholder
> `$1`/`$2` WAJIB dipakai setiap kali ada nilai yang datangnya dari
> luar (input user, parameter URL, body request) — gak ada
> pengecualian.

> 🎤 **Cara ngomonginnya:** *"Bayangin query itu FORMULIR, dan `$1`
> itu KOTAK KHUSUS buat diisi jawaban. Jawabannya, apa pun isinya,
> DIPERLAKUKAN SEBAGAI DATA — gak akan pernah dianggap PERINTAH
> tambahan. Kalau kamu nyambung teks langsung, batas antara 'ini data'
> sama 'ini perintah' jadi ilang — dan itu yang dieksploitasi orang
> jahat."*

---

## 3️⃣ Migration — Riwayat Perubahan Struktur Database

### Masalahnya

`CREATE TABLE` yang kamu ketik manual di `psql` kemarin cuma nempel di
DATABASE KAMU doang. Begitu ada murid lain, atau nanti project ini
di-deploy ke server, gimana caranya SEMUA tempat itu punya struktur
tabel yang SAMA PERSIS? Ketik manual ulang satu-satu? Gampang lupa,
gampang beda.

### Solusinya — File Migration Bernomor

```text
migrations/
├── 001_create_buku.sql
├── 002_tambah_kolom_stok.sql
└── 003_tambah_kolom_penulis.sql
```

- Tiap file = SATU perubahan struktur (bikin tabel, atau ubah tabel
  yang udah ada).
- Nomor di depan nama file nentuin URUTAN dijalanin — HARUS berurutan,
  karena migration ke-2 mungkin butuh tabel dari migration ke-1 udah
  ada duluan.
- Ada TABEL KHUSUS, `schema_migrations`, yang nyatet file mana aja
  yang UDAH pernah dijalanin — jadi kalau runner-nya dijalanin ulang,
  file yang UDAH jalan gak diulang lagi (aman, gak error "table
  already exists").

### Runner-nya (disediain di `test/migrate.js`, silakan dibaca)

```js
async function jalankanMigrasi(pool, folderMigrasi) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename VARCHAR(255) PRIMARY KEY,
      applied_at TIMESTAMP DEFAULT now()
    )
  `);

  const sudahJalan = new Set(
    (await pool.query("SELECT filename FROM schema_migrations")).rows.map((r) => r.filename)
  );

  const files = fs.readdirSync(folderMigrasi).filter((f) => f.endsWith(".sql")).sort();

  for (const file of files) {
    if (sudahJalan.has(file)) continue; // skip yang udah pernah jalan
    const sql = fs.readFileSync(path.join(folderMigrasi, file), "utf8");
    await pool.query(sql);
    await pool.query("INSERT INTO schema_migrations (filename) VALUES ($1)", [file]);
  }
}
```

- `schema_migrations` itu kayak **daftar hadir** — sebelum jalanin
  file migration, dia cek dulu "file ini udah absen belum?"
- `.sort()` pada nama file itu kenapa PENOMORAN DI DEPAN NAMA FILE
  penting — `001_...` pasti kesortir sebelum `002_...`.
- Ini yang bikin migration **idempotent**: dijalanin sekali atau
  seratus kali, hasil akhirnya SAMA — file yang udah jalan gak diulang.

> 🎤 **Cara ngomonginnya:** *"Ini kayak checklist renovasi rak arsip.
> Tiap langkah renovasi dicatet di kertas terpisah, dinomorin. Ada
> 'daftar hadir' yang nyatet langkah mana yang UDAH dikerjain. Kalau
> ada rak arsip baru (laptop lain, server baru), tinggal jalanin
> SEMUA langkah dari nomor 1 — hasilnya PASTI sama kayak rak arsip
> yang lama, gak peduli udah berapa kali langkah itu 'dicoba lagi'."*

---

## ✅ Ringkasan

| Istilah | Artinya |
|---|---|
| **`Pool`** | Kolam koneksi database yang dipinjem-pakai otomatis, dipakai daripada connect satu-satu (`Client`) |
| **`pool.query(text, params)`** | Cara kode JS ngirim SQL ke database |
| **Parameterized query (`$1`, `$2`)** | Cara AMAN masukin nilai dari luar ke query — WAJIB, cegah SQL Injection |
| **Migration** | File SQL bernomor yang nyatet SATU perubahan struktur database |
| **`schema_migrations`** | Tabel "daftar hadir" — nyatet migration mana yang udah pernah dijalanin |
| **Idempotent** | Dijalanin berkali-kali, hasilnya tetep sama (gak dobel-dobel) |

---

## 🧠 Cek Paham Sebelum Lanjut ke Soal

1. *"Kenapa pakai `Pool`, bukan `Client` satu-satu?"*
2. *"Kenapa `WHERE nama = '${namaInput}'` itu berbahaya, dan `WHERE
   nama = $1` itu aman?"*
3. *"Kalau ada 2 file migration, `002_tambah_kolom.sql` dan
   `001_buat_tabel.sql`, mana yang dijalanin duluan, dan kenapa?"*

Kalau 3 ini kejawab lancar, lanjut ke latihan di folder `soal/`.
