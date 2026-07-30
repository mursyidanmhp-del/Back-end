# 📘 Materi — Express Dasar

> 🎯 **Materi ini didesain biar kamu (pengajar) bisa langsung ngajarin
> cuma dengan SEKALI baca.** Tiap bagian ada skrip "cara ngomonginnya"
> ke murid — tinggal ikutin alurnya.

Baca ini dulu sebelum mengajar / mengerjakan latihan.

---

## 🎬 Buka dengan Analogi Ini: Express = Restoran

Bayangin kamu bikin RESTORAN. Selama ini (pas belajar Node.js dasar),
kamu udah punya "dapur" (Node.js) — tapi belum ada cara buat PELANGGAN
mesen dari luar. **Express** itu yang bikin restoran kamu punya:

- **Meja-meja dengan nomor menu** (disebut *route* — alamat yang bisa
  "dipesan" dari luar, misalnya `/buku` atau `/sapa`)
- **Pelayan yang nerima pesanan** (disebut *request*, disingkat `req`)
- **Pelayan yang nganterin makanan balik** (disebut *response*,
  disingkat `res`)
- **Kartu status pesanan** (disebut *status code* — 200 artinya
  "berhasil disajikan", 201 artinya "pesanan baru berhasil dicatat",
  404 artinya "menu itu gak ada")

> 🎤 **Cara buka sesi:** *"Bayangin kamu punya restoran. Selama ini
> dapurnya (Node.js) udah jalan, tapi belum ada cara pelanggan mesen
> dari luar. Express itu yang nambahin meja, pelayan, sama sistem
> pesanannya. Yuk kita bangun restoran pertama kamu."*

---

## 1️⃣ Membuat "Restoran" Pertama

```js
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Halo dari Express!");
});

module.exports = app;
```

Bedah satu-satu:

- `const express = require("express")` — ambil "alat bikin restoran"
  dari module Express (module BAWAAN dari luar, bukan buatan sendiri —
  makanya di-require TANPA `./`, sama kayak `require("path")` yang
  udah kamu pelajari).
- `const app = express()` — ini bikin "restoran" barunya. `app` adalah
  restoran kamu.
- `app.get("/", (req, res) => { ... })` — ini bikin 1 MEJA/MENU baru:
  kalau ada yang "mesen" ke alamat `/` (halaman utama) pakai METODE
  `GET` (artinya "minta lihat/ambil sesuatu"), jalanin function ini.
- `res.send(...)` — ini pelayan nganterin makanannya balik ke
  pelanggan (teks yang dikirim sebagai jawaban).

> ⚠️ **Penting:** Di soal latihan, kamu TIDAK perlu (dan DILARANG)
> nulis `app.listen(...)`. Biasanya Express beneran "buka restoran"
> pakai `app.listen(3000, ...)` supaya bisa diakses lewat browser.
> Tapi cara TEST otomatis di modul ini connect LANGSUNG ke `app`-nya
> tanpa perlu buka port sungguhan (pakai alat bernama `supertest`) —
> jadi `module.exports = app` di akhir file itu WAJIB, `app.listen()`
> JANGAN dipakai di file soal.

> 🎤 **Cara ngomonginnya:** *"Menu / `/` itu kayak alamat pintu masuk
> restoran. `req` itu pesanan yang dateng, `res` itu cara kamu ngasih
> makanannya balik. `res.send(teks)` = ngasih makanan berupa teks
> biasa."*

---

## 2️⃣ Route Parameter — Meja dengan Nomor Custom

Kadang alamatnya butuh BAGIAN YANG BERUBAH-UBAH — misalnya
`/sapa/Budi`, `/sapa/Ani`, dst. Ini namanya *route parameter*, ditandai
titik dua `:` di depan namanya.

```js
app.get("/sapa/:nama", (req, res) => {
  res.send("Halo, " + req.params.nama + "!");
});
```

Kalau pelanggan mesen ke `/sapa/Budi`, maka `req.params.nama` isinya
`"Budi"`. Kalau mesen ke `/sapa/Ani`, `req.params.nama` isinya `"Ani"`.
SATU route bisa ngelayanin BANYAK alamat yang mirip.

> 🎤 **Cara ngomonginnya:** *"`:nama` itu kayak kolom kosong di form
> pemesanan — apa pun yang pelanggan tulis di situ (Budi, Ani, siapa
> aja), itu yang masuk ke `req.params.nama`."*

---

## 3️⃣ Query String — Catatan Tambahan di Pesanan

Ini cara lain buat ngirim info tambahan, ditulis pakai `?` di URL:
`/cari?keyword=laptop`.

```js
app.get("/cari", (req, res) => {
  res.send("Mencari: " + req.query.keyword);
});
```

Kalau pelanggan buka `/cari?keyword=laptop`, maka `req.query.keyword`
isinya `"laptop"`.

> 🎤 **Cara ngomonginnya:** *"Kalau route parameter (`:nama`) itu
> bagian WAJIB dari alamatnya, query string (`?keyword=...`) itu kayak
> CATATAN TAMBAHAN yang sifatnya opsional — 'oh iya, tolong carikan
> yang keyword-nya laptop ya'."*

---

## 4️⃣ POST & Body — Pesanan yang Dikirim Lewat "Amplop"

Sejauh ini semua contoh pakai `app.get(...)` — itu buat AMBIL/LIHAT
data. Kalau mau KIRIM data baru (misalnya nambah buku baru), pakai
`app.post(...)`, dan datanya dikirim lewat **body** (bukan di alamat
URL, tapi "amplop terpisah").

```js
app.use(express.json());  // <- WAJIB ada, biar body-nya kebaca

app.post("/buku", (req, res) => {
  res.status(201).json({ judul: req.body.judul, pesan: "Buku ditambahkan" });
});
```

**`app.use(express.json())`** itu **middleware** — kayak "petugas
penerjemah" yang berdiri SEBELUM pesanan sampai ke dapur. Tanpa ini,
`req.body` bakal `undefined` walaupun pelanggan udah ngirim data.

**`res.status(201).json({...})`** — `status(201)` itu kartu status
"berhasil DIBUAT/dicatat" (beda dari 200 yang artinya "berhasil
diambil/dilihat"). `.json({...})` ngirim jawaban dalam bentuk object,
bukan teks polos.

> 🎤 **Cara ngomonginnya:** *"Kalau GET itu pelanggan cuma nunjuk menu
> ('aku mau lihat ini'), POST itu pelanggan ngasih FORM PESANAN BARU
> ('tolong catat pesanan baru ini'). Makanya butuh 'petugas penerjemah'
> (`express.json()`) biar form-nya kebaca dengan benar."*

---

## 5️⃣ Status Code — Kartu Status Pesanan

| Kode | Artinya | Kapan dipakai |
|---|---|---|
| **200** | OK — berhasil | Berhasil AMBIL/LIHAT data (GET) |
| **201** | Created — berhasil dibuat | Berhasil BIKIN data baru (POST) |
| **404** | Not Found — gak ketemu | Alamat/data yang diminta gak ada |

> 🎤 **Cara ngomonginnya:** *"200 itu kayak pelayan bilang 'ini
> pesanan Anda' — berhasil ngasih yang diminta. 201 itu kayak resi
> 'pesanan baru Anda sudah dicatat, nomor antriannya sekian' —
> beda konteks dari 200."*

---

## 6️⃣ Menggabungkan Semuanya: CRUD Buku

Ingat lagi array of objects (`perpustakaan`) dari Fase 0? Sekarang kita
"pasang" array itu ke Express, supaya bisa diakses dari luar lewat
route.

```js
let perpustakaan = [
  { id: 1, judul: "Laskar Pelangi" },
  { id: 2, judul: "Bumi Manusia" }
];

app.get("/buku", (req, res) => {
  res.status(200).json(perpustakaan); // tampilkan SEMUA buku
});

app.get("/buku/:id", (req, res) => {
  let buku = perpustakaan.find(function (b) {
    return b.id === Number(req.params.id);
  });
  res.status(200).json(buku); // tampilkan 1 buku spesifik
});

app.post("/buku", (req, res) => {
  let bukuBaru = { id: perpustakaan.length + 1, judul: req.body.judul };
  perpustakaan.push(bukuBaru); // tambah buku baru ke array
  res.status(201).json(bukuBaru);
});
```

Perhatikan: **`find`, `push`, array of objects** — semua yang udah kamu
kuasai di Fase 0 dipakai LAGI di sini, cuma sekarang "dipasang" ke
route supaya bisa diakses dari luar (nanti dari Postman, nanti dari
React). Ini BUKAN materi baru yang beda — ini gabungan dari semua yang
udah kamu pelajari.

> 🎤 **Cara nutup sesi:** *"Lihat, kan? `find` sama `push` yang kamu
> udah kuasai dari Fase 0 sekarang dipakai buat bikin API beneran.
> Express itu cuma 'pembungkus' — logic di dalamnya tetap JavaScript
> biasa yang udah kamu kenal."*

---

## ✅ Ringkasan

| Istilah | Artinya |
|---|---|
| **Express** | Framework yang bikin Node.js gampang dipakai buat bikin server |
| **`app.get/post(path, handler)`** | Bikin route — alamat yang bisa "dipesan" dari luar |
| **`req`** | Data yang MASUK dari pelanggan (params, query, body) |
| **`res`** | Cara ngirim jawaban balik (`send`, `json`, `status`) |
| **`req.params`** | Bagian WAJIB dari alamat (`/sapa/:nama`) |
| **`req.query`** | Bagian OPSIONAL, ditulis pakai `?` (`?keyword=...`) |
| **`req.body`** | Data yang dikirim lewat POST, butuh `express.json()` dulu |
| **Middleware** | "Petugas" yang jalan SEBELUM route-nya, misal `express.json()` |

---

## 🧠 Cek Paham Sebelum Lanjut ke Soal

1. *"Bedanya `req.params` sama `req.query` apa? Kapan pakai yang mana?"*
2. *"Kenapa `app.use(express.json())` harus ada sebelum bisa baca
   `req.body`?"*
3. *"Kenapa di soal ini kita gak pakai `app.listen(...)`?"*

Kalau 3 ini kejawab lancar, lanjut ke latihan di folder `soal/`.
