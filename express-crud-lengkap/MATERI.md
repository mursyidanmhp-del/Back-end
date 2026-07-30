# 📘 Materi — Express CRUD Lengkap (PUT & DELETE)

> 🎯 **Materi ini didesain biar kamu (pengajar) bisa langsung ngajarin
> cuma dengan SEKALI baca.** Tiap bagian ada skrip "cara ngomonginnya"
> ke murid — tinggal ikutin alurnya.

Baca ini dulu sebelum mengajar / mengerjakan latihan. Ini LANJUTAN dari
[express-dasar](../express-dasar/MATERI.md) — analogi restorannya
masih sama, cuma sekarang kita nutup 2 method yang belum dibahas.

---

## 🎬 Buka dengan Ini: Restoran Kamu Sekarang Lengkap

> 🎤 **Cara buka sesi:** *"Inget analogi restoran kemarin? Kamu udah
> bisa: pelanggan LIHAT menu (GET), pelanggan PESAN yang baru (POST).
> Tapi restoran beneran juga butuh: pelanggan MINTA GANTI pesanan yang
> udah masuk (UPDATE), sama pelanggan BATALIN pesanan (HAPUS). Itu
> yang kita bahas hari ini — PUT sama DELETE."*

Ingetin 1 hal penting di depan: **kode `req`, `res`, `req.params`,
`req.body`, `res.status()` — SEMUA itu masih sama persis kayak
kemarin.** Yang baru cuma NAMA method-nya (`app.put`, `app.delete`) dan
CARA olah datanya.

---

## 1️⃣ PUT — Update Data yang Sudah Ada

```js
app.put("/buku/:id", (req, res) => {
  let buku = perpustakaan.find(function (b) {
    return b.id === Number(req.params.id);
  });
  buku.judul = req.body.judul;
  res.status(200).json(buku);
});
```

Bedah baris per baris — ini penting banget, jangan lompatin:

- **`app.put("/buku/:id", ...)`** — persis kayak `app.get("/buku/:id", ...)`
  kemarin, `:id` itu route parameter (bagian alamat yang berubah-ubah).
  Bedanya cuma di kata `put` — nandain ini buat UBAH data, bukan AMBIL.
- **`perpustakaan.find(...)`** — ini cara kita NEMUIN buku yang mau
  diubah dari dalam array. Sama persis kayak `find` yang dipakai di
  soal CRUD kemarin buat `GET /buku/:id`.
- **`buku.judul = req.body.judul;`** — INI BAGIAN BARUNYA. `find`
  ngasih kita REFERENSI ke object aslinya di dalam array (bukan
  salinan) — jadi begitu kita ubah `buku.judul`, object yang ASLI di
  dalam `perpustakaan` ikut berubah juga.
- **`res.status(200).json(buku)`** — balikin buku yang UDAH DIUPDATE
  sebagai bukti perubahan berhasil. Status `200` (bukan `201`) karena
  ini bukan bikin data baru, cuma UBAH yang lama.

> ⚠️ **Titik paling gampang bikin bingung:** murid sering nanya "kok
> `buku.judul = ...` bisa ngubah `perpustakaan` juga, padahal kita gak
> nyentuh `perpustakaan` langsung?" Jawabannya: `buku` itu BUKAN
> salinan — dia nunjuk ke OBJECT YANG SAMA PERSIS di dalam array
> (dalam JavaScript, object itu direferensikan, bukan di-copy). Ini
> beda sama waktu kita belajar spread kemarin (spread justru dipakai
> buat BIKIN salinan biar gak ke-reference kayak gini).

> 🎤 **Cara ngomonginnya:** *"`find` itu kayak nunjuk ke buku yang ADA
> DI RAK, bukan minjem terus fotokopi. Begitu kamu nulisin sesuatu di
> buku yang kamu tunjuk itu, buku yang di rak juga ikut berubah — sama
> objectnya, cuma beda cara nyebutnya."*

---

## 2️⃣ DELETE — Hapus Data

```js
app.delete("/buku/:id", (req, res) => {
  perpustakaan = perpustakaan.filter(function (b) {
    return b.id !== Number(req.params.id);
  });
  res.status(200).json({ pesan: "Buku dihapus", sisa: perpustakaan.length });
});
```

Bedah baris per baris:

- **`app.delete("/buku/:id", ...)`** — method baru buat HAPUS, tapi
  route-nya (`/buku/:id`) sama persis kayak PUT dan GET satu buku.
- **`perpustakaan.filter(function (b) { return b.id !== ... })`** —
  ini cara HAPUS yang paling aman: bukan "cari terus buang", tapi
  "bikin array baru isinya SEMUA KECUALI yang mau dihapus." Perhatiin
  tanda `!==` (TIDAK SAMA DENGAN) — kita SIMPAN semua yang idnya BEDA
  dari yang mau dihapus.
- **`perpustakaan = perpustakaan.filter(...)`** — hasil `filter`
  ditimpakan LAGI ke variabel `perpustakaan` yang sama, jadi array
  aslinya "diganti" sama versi baru yang udah gak ada buku itu.
- **`res.status(200).json({ pesan: ..., sisa: perpustakaan.length })`**
  — balikin pesan konfirmasi PLUS jumlah buku yang tersisa, biar
  keliatan buktinya array beneran menyusut.

> ⚠️ **Kenapa `filter`, bukan cara lain (kayak `splice`)?** Karena
> `filter` itu konsep yang UDAH KAMU KUASAI dari Fase 0 — gak perlu
> belajar cara baru. Ini juga cara yang lebih AMAN: `filter` gak
> pernah "salah hapus nomor index" kayak yang sering kejadian kalau
> pakai cara manual berbasis index.

> 🎤 **Cara ngomonginnya:** *"Bayangin `filter` itu kamu nyaring
> ulang SELURUH rak buku: 'yang bukan buku ini, taruh lagi di rak.'
> Hasilnya, rak yang baru itu isinya semua buku KECUALI yang mau
> dibuang — padahal kamu gak pernah nyariin 'buku yang mau dihapus'
> sama sekali."*

---

## 3️⃣ Menggabungkan Semuanya: REST API yang Beneran Lengkap

Ini titik pentingnya: **5 method ini semua bekerja di ATAS ARRAY YANG
SAMA** (`perpustakaan`). Gak ada yang baru secara konsep — cuma
gabungan dari semua yang udah dipelajari.

```js
app.get("/buku", (req, res) => {
  res.status(200).json(perpustakaan);                    // LIHAT semua
});

app.get("/buku/:id", (req, res) => {
  let buku = perpustakaan.find(...);
  res.status(200).json(buku);                             // LIHAT satu
});

app.post("/buku", (req, res) => {
  let bukuBaru = { id: perpustakaan.length + 1, judul: req.body.judul };
  perpustakaan.push(bukuBaru);
  res.status(201).json(bukuBaru);                         // BIKIN baru
});

app.put("/buku/:id", (req, res) => {
  let buku = perpustakaan.find(...);
  buku.judul = req.body.judul;
  res.status(200).json(buku);                             // UBAH yang ada
});

app.delete("/buku/:id", (req, res) => {
  perpustakaan = perpustakaan.filter(...);
  res.status(200).json({ pesan: "Buku dihapus", sisa: perpustakaan.length }); // HAPUS
});
```

> 🎤 **Cara nutup sesi:** *"Ini namanya CRUD — Create (POST), Read
> (GET), Update (PUT), Delete (DELETE). 4 huruf ini bakal kamu ketemu
> di HAMPIR SEMUA aplikasi yang pernah kamu pakai — media sosial,
> e-commerce, semuanya. Yang beda nanti cuma: sekarang datanya
> disimpan di array (hilang kalau server restart), abis ini kita ganti
> jadi database beneran (PostgreSQL) — tapi POLA-nya PERSIS SAMA kayak
> yang barusan kamu tulis."*

---

## ✅ Ringkasan

| Method | Singkatan CRUD | Fungsi | Status code khas |
|---|---|---|---|
| **GET** | Read | Ambil/lihat data | 200 |
| **POST** | Create | Bikin data baru | 201 |
| **PUT** | Update | Ubah data yang sudah ada | 200 |
| **DELETE** | Delete | Hapus data | 200 |

| Istilah | Artinya |
|---|---|
| `find` | Nemuin SATU object di array (dan itu REFERENSI ke aslinya, bukan salinan) |
| `filter` | Bikin array BARU isinya cuma yang lolos syarat — dipakai buat DELETE dengan cara "simpan semua KECUALI yang dihapus" |
| `buku.judul = ...` | Ubah property langsung dari object yang di-`find`, otomatis kena juga ke array aslinya |

---

## 🧠 Cek Paham Sebelum Lanjut ke Soal

1. *"Kenapa pas kita ubah `buku.judul` di soal PUT, array
   `perpustakaan`-nya ikut berubah juga? Padahal kita gak pernah
   nulis `perpustakaan.sesuatu = ...`."*
2. *"Kenapa DELETE pakai `filter` (bikin array baru) bukan
   'cari terus hapus di posisi itu'?"*
3. *"Kalau kamu liat semua 5 method sekaligus di soal 3, coba
   sebutin: yang mana yang Create, Read, Update, Delete?"*

Kalau 3 ini kejawab lancar, lanjut ke latihan di folder `soal/`.
