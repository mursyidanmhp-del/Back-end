# 📘 Materi — PostgreSQL Query Dasar

> 🎯 **Materi ini didesain biar kamu (pengajar) bisa langsung ngajarin
> cuma dengan SEKALI baca.** Tiap bagian ada skrip "cara ngomonginnya"
> ke murid — tinggal ikutin alurnya.

Baca ini dulu sebelum mengajar / mengerjakan latihan.

Ini Phase 3 dari [ROADMAP](../../ic-01/ROADMAP.md) — SQL & PostgreSQL
Fundamentals. Bedanya sama modul-modul sebelumnya (`express-dasar`,
`express-crud-lengkap`): di sana data disimpan di **array of objects
yang hidup di memory** — begitu server di-restart, data hilang. Modul
ini ngajarin cara nyimpen data **beneran permanen**, di disk, pakai
database PostgreSQL.

---

## 🎬 Buka dengan Analogi Ini: Dari Buku Catatan ke Lemari Arsip

Selama ini (Phase 2, Express), data itu kayak **buku catatan yang kamu
pegang sendiri** — gampang diubah, tapi kalau bukunya ilang (server
restart), semua catatan ilang juga.

**Database** itu kayak **lemari arsip kantor**: ada PETUGAS (PostgreSQL
server) yang jagain lemari itu, dan kamu gak langsung pegang kertasnya
— kamu **minta** ke petugas pakai bahasa tertentu ("tolong ambilin
arsip si Budi", "tolong tambahin arsip baru"). Bahasa buat ngomong ke
petugas itu namanya **SQL** (Structured Query Language).

Satu **table** itu kayak satu **rak arsip khusus** (misal: rak khusus
"data siswa"). Satu **row** (baris) itu satu **map/folder** dalam rak
itu (satu siswa). Satu **column** (kolom) itu satu **kategori
informasi** yang SEMUA folder di rak itu punya (nama, kelas, nilai —
setiap folder siswa punya kolom yang sama).

> 🎤 **Cara buka sesi:** *"Inget Phase 2 kemarin, data disimpen di
> array yang ilang kalau server restart? Sekarang kita belajar cara
> nyimpen data BENERAN, permanen, pakai database. Bayangin database itu
> lemari arsip kantor — kamu gak pegang kertasnya langsung, kamu minta
> ke 'petugas' pakai bahasa SQL..."*

---

## 0️⃣ Kenapa Butuh Database?

- Array of objects di Express (Phase 2) **hilang setiap server
  di-restart** — karena datanya cuma hidup di RAM (memory), bukan di
  disk.
- Database nyimpen data di **disk**, jadi tetap ada meskipun server
  mati-nyala berkali-kali.
- Database juga ngasih jaminan struktur (tipe data, constraint) yang
  array of objects gak punya — misal, gak bisa "lupa" isi field wajib
  kalau database-nya udah diset `NOT NULL`.

> 🎤 **Cara ngomonginnya:** *"Coba bayangin server kamu restart 100x
> sehari (di produksi beneran ini normal). Kalau data di array, abis
> restart datanya balik ke titik nol. Database itu solusinya — datanya
> nempel di disk, gak peduli server-nya restart berapa kali."*

---

## 1️⃣ Instalasi PostgreSQL (di luar kode)

Sebelum masuk `soal/`, PostgreSQL harus sudah TERPASANG dan JALAN di
komputer murid, karena test di modul ini **beneran konek ke database
asli** (bukan cuma cek teks kayak modul-modul sebelumnya).

> 🎤 **Cara ngomonginnya:** *"Bedanya sama latihan-latihan JS
> sebelumnya: kali ini kode SQL kamu bakal BENERAN dijalankan ke
> database asli di komputer kamu, bukan cuma dicek teksnya doang. Jadi
> sebelum ngerjain soal, kita setup dulu databasenya — lewat terminal,
> pakai `psql`."*

### Langkah 1 — Install PostgreSQL (Windows)

1. Download installer resmi dari
   [postgresql.org/download/windows](https://www.postgresql.org/download/windows/)
   (link "Download the installer" → EnterpriseDB). Pilih versi terbaru
   (misal 16.x), pilih Windows x86-64.
2. Jalankan installer-nya. Pas wizard jalan, penting diperhatiin:
   - **Components**: biarin default (PostgreSQL Server, pgAdmin 4,
     Command Line Tools tetep DICENTANG — Command Line Tools itu yang
     ngasih `psql`).
   - **Password**: installer bakal minta bikin password buat
     superuser `postgres`. **INGET/CATET password ini** — ini yang
     nanti dipakai isi `PGPASSWORD` di `.env`.
   - **Port**: biarin default `5432`.
   - Sisanya (data directory, locale) biarin default, tinggal Next
     terus sampai selesai.
3. Setelah selesai, PostgreSQL otomatis jalan sebagai **Windows
   Service** (namanya `postgresql-x64-16`) — beda sama Mac yang perlu
   `brew services start` manual, di Windows dia OTOMATIS nyala tiap
   komputer nyala, gak perlu dinyalain manual tiap mau kerja.

Buka **Command Prompt** atau **PowerShell**, cek udah kepasang & bisa
diakses:

```bat
psql --version
```

> ⚠️ Kalau muncul error `'psql' is not recognized...`, berarti
> Command Line Tools belum masuk PATH. Cara benerin: cari folder
> instalasinya (biasanya `C:\Program Files\PostgreSQL\16\bin`), lalu
> tambahin ke PATH lewat **Edit environment variables for your
> account** (search di Start Menu) → pilih `Path` → **New** → paste
> path folder `bin` itu → OK semua → **buka Command Prompt/PowerShell
> yang BARU** (yang lama gak ke-refresh).

### Langkah 2 — Server Udah Otomatis Jalan

Beda sama Mac, di Windows service PostgreSQL-nya OTOMATIS start abis
instalasi (dan tiap komputer nyala). Cek udah nerima koneksi:

```bat
pg_isready
```

Kalau hasilnya `accepting connections`, tinggal lanjut bikin database.
(Kalau suatu saat perlu restart service-nya: search "Services" di
Start Menu → cari `postgresql-x64-16` → klik kanan → Restart.)

### Langkah 3 — Bikin Database dari Terminal

Karena di Windows password WAJIB (beda sama setup default Mac tadi
yang "trust"), tiap perintah bakal nanya password `postgres` yang
dicatet pas instalasi. Ada 2 cara, dua-duanya valid:

**Cara A — satu baris, paling cepat:**

```bat
createdb -U postgres nama_database_kamu
```

(bakal muncul prompt `Password:` — ketik passwordnya, Enter)

**Cara B — masuk ke `psql` dulu, baru bikin database:**

```bat
psql -U postgres
```

Ini masuk ke "mode interaktif" `psql`, connect ke database bawaan
`postgres` (bakal diminta password dulu). Di dalamnya, ketik perintah
SQL biasa:

```sql
CREATE DATABASE nama_database_kamu;
```

> 💡 Kalau tutor-nya pakai Mac (Homebrew: `brew install
> postgresql@16` → `brew services start postgresql@16`) dan murid
> pakai Windows kayak di atas, itu WAJAR beda — cuma cara instalnya
> yang beda, `psql` dan perintah SQL-nya sama persis di kedua OS.

### Cara Mastiin `createdb` Beneran Berhasil

`createdb`/`CREATE DATABASE` itu **diam kalau sukses** — gak ada
pesan "berhasil!" apa pun, cuma balik ke prompt biasa. Ini sering
bikin murid ragu. Cara mastiinnya:

```bat
psql -U postgres -l
```

(`-l` = list). Ini nampilin tabel semua database yang ada — cek nama
database yang baru dibikin ADA di daftar itu.

Atau connect langsung ke database-nya:

```bat
psql -U postgres -d nama_database_kamu
```

Kalau BERHASIL connect, prompt-nya berubah jadi
`nama_database_kamu=#` (bukan lagi `postgres=#`) — itu tandanya
database-nya BENERAN ada dan bisa diakses. Kalau SALAH nama/gak ada,
muncul error `database "..." does not exist`.

> 🎤 **Cara ngomonginnya:** *"Di terminal, diem itu artinya sukses —
> beda sama di kode yang biasanya ada console.log konfirmasi. Kalau
> mau BUKTI databasenya beneran kebikin, connect langsung ke situ:
> `psql -U postgres -d nama_database`. Kalau prompt-nya berubah jadi
> nama database itu, berarti udah bener."*

### Perintah `psql` yang Wajib Dikenalin ke Murid

Begitu masuk `psql`, prompt-nya berubah jadi `nama_database=#`. Dari
sini murid bisa:

| Perintah | Artinya |
|---|---|
| `\l` | Lihat semua database yang ada |
| `\c nama_database` | Pindah connect ke database lain |
| `\dt` | Lihat semua table di database yang lagi aktif |
| `\d nama_table` | Lihat struktur kolom satu table |
| `\q` | Keluar dari psql, balik ke terminal biasa |

> 🎤 **Cara ngomonginnya:** *"`psql` itu kayak masuk ke 'ruangan
> khusus' buat ngobrol sama database — begitu masuk, prompt-nya
> berubah nunjukin kamu lagi connect ke database mana. Ketik query SQL
> langsung di situ, diakhiri titik koma. `\q` itu cara keluar
> ruangannya, balik ke terminal biasa."*

### Setup Database Khusus buat Modul Ini

Buat ngerjain `soal/` di modul ini, bikin database `latihan_postgres_dasar`:

```bash
createdb latihan_postgres_dasar
```

Detail lengkap (termasuk kalau user/password PostgreSQL beda dari
default) ada di [README.md](README.md) bagian "Setup Database".

> 💡 Install tool GUI itu OPSIONAL, bukan wajib — **pgAdmin** atau
> **TablePlus** bisa dipakai buat lihat isi database secara visual,
> tapi semua yang dibutuhin modul ini (install, nyalain server, bikin
> database) bisa dituntasin dari terminal doang pakai `psql`.

---

## 2️⃣ CREATE TABLE — Bikin Rak Arsip Baru

```sql
CREATE TABLE siswa (
  id SERIAL PRIMARY KEY,
  nama VARCHAR(50) NOT NULL,
  kelas VARCHAR(10),
  nilai INTEGER DEFAULT 0
);
```

- `CREATE TABLE siswa (...)` — bikin rak arsip baru namanya `siswa`.
- Tiap baris di dalam kurung itu SATU KOLOM: `nama_kolom TIPE_DATA
  ATURAN`.
- **Tipe data kolom yang umum dipakai:**

| Tipe | Buat nyimpen apa |
|---|---|
| `SERIAL` | Angka yang OTOMATIS nambah sendiri (1, 2, 3, ...) — cocok buat `id` |
| `VARCHAR(n)` | Teks pendek, maksimal `n` karakter (misal nama, judul) |
| `INTEGER` | Angka bulat (nilai, umur, stok) |
| `BOOLEAN` | `true`/`false` (misal: `is_lulus`) |
| `TIMESTAMP` | Tanggal + jam (misal: kapan data dibuat) |

- **Constraint (aturan tambahan) yang umum dipakai:**

| Constraint | Artinya |
|---|---|
| `PRIMARY KEY` | Kolom ini ID UNIK buat tiap baris — gak boleh kembar, gak boleh kosong |
| `NOT NULL` | Kolom ini WAJIB diisi, gak boleh kosong |
| `UNIQUE` | Nilai di kolom ini gak boleh ada yang kembar (tapi boleh kosong) |
| `DEFAULT nilai` | Kalau gak diisi pas insert, otomatis dikasih `nilai` ini |

> 🎤 **Cara ngomonginnya:** *"`CREATE TABLE` itu kamu lagi bikin
> FORMULIR KOSONG buat rak arsip baru — nentuin kolom apa aja yang tiap
> folder di rak itu WAJIB punya, dan aturan-aturan tiap kolomnya. Kayak
> bikin template formulir pendaftaran siswa: ada kolom nama (wajib
> diisi), kelas, nilai (kalau kosong dianggap 0)."*

---

## 3️⃣ INSERT INTO — Nambah Data Baru

```sql
INSERT INTO siswa (nama, kelas, nilai) VALUES ('Andi', '12 IPA', 90);
```

- `INSERT INTO siswa (nama, kelas, nilai)` — "aku mau nambahin data ke
  rak `siswa`, isi kolom `nama`, `kelas`, `nilai`."
- `VALUES ('Andi', '12 IPA', 90)` — nilai buat tiap kolom, URUTANNYA
  HARUS SESUAI sama urutan kolom yang disebut sebelumnya.
- Kolom `id` **gak perlu disebut** kalau tipe-nya `SERIAL` — dia
  keisi OTOMATIS.

> 🎤 **Cara ngomonginnya:** *"`INSERT INTO` itu kamu lagi isi FORMULIR
> yang tadi dibikin di `CREATE TABLE`, terus masukin ke raknya. `id`
> gak usah kamu isi — itu tugas database, dia yang nomorin otomatis."*

---

## 4️⃣ SELECT — Ambil Data

```sql
SELECT * FROM siswa;          -- ambil SEMUA kolom, SEMUA baris
SELECT nama, nilai FROM siswa; -- ambil kolom TERTENTU aja
```

- `SELECT * FROM siswa` — "kasih aku SEMUA kolom dari rak `siswa`."
- Tanda bintang (`*`) artinya "semua kolom." Kalau cuma butuh
  sebagian, sebutin nama kolomnya, pisah pakai koma.

> 🎤 **Cara ngomonginnya:** *"Kalau `INSERT` itu ngirim data MASUK ke
> rak, `SELECT` itu kebalikannya: minta data KELUAR dari rak. Bintang
> (`*`) itu cara bilang 'kasih semua kolomnya, jangan ada yang
> disembunyiin.'"*

---

## 5️⃣ WHERE — Nyaring Data

```sql
SELECT nama FROM siswa WHERE nilai >= 80;
```

- `WHERE nilai >= 80` — "tapi cuma yang nilai-nya 80 ke atas aja."
- Operator yang sering dipakai: `=`, `!=`, `>`, `<`, `>=`, `<=`, `AND`,
  `OR`, `LIKE` (buat cari teks yang MIRIP, bukan sama persis).

> 🎤 **Cara ngomonginnya:** *"`SELECT * FROM siswa` itu 'ambil SEMUA
> folder di rak.' Tambahin `WHERE nilai >= 80`, jadi 'ambil folder,
> TAPI cuma yang nilainya 80 ke atas.' `WHERE` itu si penyaring."*

---

## 6️⃣ ORDER BY & LIMIT — Urutkan & Batasi

```sql
SELECT nama, nilai FROM siswa ORDER BY nilai DESC LIMIT 2;
```

- `ORDER BY nilai DESC` — urutkan hasil berdasarkan kolom `nilai`,
  dari BESAR ke KECIL (`DESC` = descending). Kebalikannya `ASC`
  (ascending, kecil ke besar — ini default kalau gak ditulis).
- `LIMIT 2` — cuma ambil 2 baris PERTAMA dari hasil yang udah
  diurutkan.

> 🎤 **Cara ngomonginnya:** *"`ORDER BY nilai DESC` itu kayak nyusun
> folder dari yang nilainya paling gede taruh paling depan. `LIMIT 2`
> itu 'aku cuma butuh 2 folder paling depan aja' — kayak bikin papan
> peringkat top 2."*

---

## 7️⃣ UPDATE — Ubah Data yang Sudah Ada

```sql
UPDATE siswa SET nilai = 95 WHERE nama = 'Budi';
```

- `UPDATE siswa SET nilai = 95` — "di rak `siswa`, ubah kolom `nilai`
  jadi 95."
- `WHERE nama = 'Budi'` — **WAJIB ADA**, supaya CUMA folder si Budi
  yang diubah.

> ⚠️ **BAHAYA kalau lupa `WHERE`:** `UPDATE siswa SET nilai = 95;`
> TANPA `WHERE` bakal ngubah nilai **SEMUA siswa** jadi 95, bukan cuma
> Budi. Ini kesalahan paling umum & paling berbahaya di SQL.

> 🎤 **Cara ngomonginnya:** *"`UPDATE` itu kamu buka SATU folder
> spesifik, ganti isinya, tutup lagi. `WHERE` itu yang nentuin folder
> MANA yang dibuka. Lupa `WHERE` = semua folder di rak ke-buka dan
> ke-ubah — ini kesalahan paling sering bikin data berantakan."*

---

## 8️⃣ DELETE — Hapus Data

```sql
DELETE FROM siswa WHERE nama = 'Rina';
```

- `DELETE FROM siswa` — "hapus folder dari rak `siswa`."
- `WHERE nama = 'Rina'` — **WAJIB ADA**, sama kayak `UPDATE`, supaya
  cuma folder Rina yang kehapus.

> ⚠️ **BAHAYA kalau lupa `WHERE`:** `DELETE FROM siswa;` TANPA `WHERE`
> bakal ngosongin SELURUH isi rak `siswa`, bukan cuma satu folder.

> 🎤 **Cara ngomonginnya:** *"Sama kayak `UPDATE`, `DELETE` tanpa
> `WHERE` itu kayak buang SEMUA folder di rak, bukan cuma satu. Selalu
> tanya ke diri sendiri sebelum jalanin `UPDATE`/`DELETE`: 'ini `WHERE`
> nya udah bener belum?'"*

---

## ✅ Ringkasan

| Perintah | Artinya |
|---|---|
| `CREATE TABLE` | Bikin rak arsip baru (struktur kolom + tipe data + constraint) |
| `INSERT INTO ... VALUES` | Nambah satu folder/baris data baru |
| `SELECT` | Ambil data (`*` = semua kolom, atau sebutin kolom tertentu) |
| `WHERE` | Nyaring baris mana aja yang mau diambil/diubah/dihapus |
| `ORDER BY ... ASC/DESC` | Urutkan hasil, kecil→besar atau besar→kecil |
| `LIMIT n` | Batasin cuma ambil `n` baris teratas |
| `UPDATE ... SET ... WHERE` | Ubah data yang sudah ada (WAJIB pakai `WHERE`) |
| `DELETE FROM ... WHERE` | Hapus data (WAJIB pakai `WHERE`) |

---

## 🧠 Cek Paham Sebelum Lanjut ke Soal

1. *"Bedanya `SELECT *` sama `SELECT nama, nilai` apa?"*
2. *"Kenapa `UPDATE` sama `DELETE` tanpa `WHERE` itu berbahaya?"*
3. *"Kalau mau ambil 3 siswa dengan nilai paling rendah, kombinasi
   perintah apa yang dipakai?"* (jawaban: `ORDER BY nilai ASC LIMIT
   3`)

Kalau 3 ini kejawab lancar, lanjut ke latihan di folder `soal/` — tapi
setup database-nya dulu (lihat [README.md](README.md)).

---

## 🔜 Lanjutan Setelah Modul Ini

Modul ini baru nyentuh SATU table. Phase 3 di ROADMAP juga nyebut
relasi antar table (`FOREIGN KEY`, `JOIN`) — itu bakal jadi modul
lanjutan SETELAH `postgres-query-dasar` ini solid, sebelum masuk Phase
4 (menghubungkan Express + PostgreSQL pakai package `pg`).
