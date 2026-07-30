# 📘 Latihan — Destructuring, Spread, & Async/Await

## 📖 Deskripsi

Latihan ini melatih 3 kebiasaan penulisan kode modern yang bakal
dipakai terus mulai sekarang: destructuring object & array, spread
operator, dan Promise/async-await. Ini jembatan wajib sebelum lanjut
ke SQL & PostgreSQL (Phase 3), karena semua query database itu
asynchronous.

> 📖 Belum familiar dengan materi ini? Baca dulu
> [MATERI.md](MATERI.md) sebelum mulai mengerjakan soal di bawah.

---

## 📁 Struktur File

```text
.
├── soal/
│   ├── 01-destructuring-object.js
│   ├── 02-destructuring-array.js
│   ├── 03-spread-operator.js
│   ├── 04-promise-dasar.js
│   ├── 05-async-await-dasar.js
│   └── 06-gabungan-async-destructuring.js
├── test/
│   ├── 01-test-destructuring-object.js
│   ├── 02-test-destructuring-array.js
│   ├── 03-test-spread-operator.js
│   ├── 04-test-promise-dasar.js
│   ├── 05-test-async-await-dasar.js
│   ├── 06-test-gabungan.js
│   ├── test-all.js
│   └── strip-comments.js
└── package.json
```

> Peserta hanya mengerjakan file di folder `soal/`. File di folder
> `test/` tidak perlu diubah.

---

## 🧪 Cara Menjalankan Test

```bash
cd destructuring-spread-async
npm test
```

Atau per soal:

```bash
npm run test:destructuring-object
npm run test:destructuring-array
npm run test:spread-operator
npm run test:promise-dasar
npm run test:async-await-dasar
npm run test:gabungan
```

---

# 🧪 SOAL 1 — DESTRUCTURING OBJECT *(mudah)*

Ambil `nama` dan `nilai` dari object `siswa` pakai destructuring
dalam satu baris.

**Diharapkan output:** `Andi` lalu `90`

---

# 🧪 SOAL 2 — DESTRUCTURING ARRAY (DENGAN SKIP) *(mudah)*

Ambil elemen pertama dan ketiga dari array `ranking`, lompati elemen
kedua, pakai destructuring array.

**Diharapkan output:** `Budi` lalu `Rina`

---

# 🧪 SOAL 3 — SPREAD OPERATOR *(sedang)*

Bikin array baru berisi isi array lama + 1 item tambahan, TANPA
mengubah array aslinya. Dilarang pakai `.push()`.

**Diharapkan output:** `2` lalu `3` (panjang array asli tetap 2, array
baru jadi 3)

---

# 🧪 SOAL 4 — PROMISE DASAR *(sedang)*

Bikin function yang me-return `new Promise`, pakai `setTimeout` buat
simulasi jeda, lalu ambil hasilnya pakai `.then()`.

**Diharapkan output:** `Data siswa: Budi`

---

# 🧪 SOAL 5 — ASYNC/AWAIT DASAR *(sedang-sulit)*

Ambil hasil Promise yang SAMA seperti soal 4, tapi pakai `async`/
`await` — bukan `.then()`.

**Diharapkan output:** `Data siswa: Budi`

---

# 🧪 SOAL 6 — GABUNGAN: ASYNC/AWAIT + DESTRUCTURING *(sulit)*

Ambil hasil Promise yang berupa object, langsung destructuring dari
hasil `await` — pola yang bakal dipakai terus di Express + database.

**Diharapkan output:** `Dinda` lalu `21`

---

## ⚠️ Ketentuan Wajib

- soal 1: `const`, `siswa`, destructuring `{ nama`
- soal 2: `const`, `ranking`, destructuring array dengan skip `[juara1, , juara3]`
- soal 3: `const`, `...belanja`
- soal 4: `function ambilData`, `new Promise`, `setTimeout`, `resolve(`, `.then(`
- soal 5: `async function main`, `await`, `new Promise`
- soal 6: `async function main`, `await ambilUser`, destructuring `{ nama`, `new Promise`

## 🚫 Larangan

- soal 1: dilarang akses `siswa.nama` / `siswa.nilai` pakai titik
- soal 2: dilarang akses `ranking[0]` / `ranking[2]` pakai kurung siku
- soal 3: dilarang `.push(`
- soal 1-3: dilarang `let`, `var`, `function`, `if`, `for`, `while`
- soal 4: dilarang `async`, `await`
- soal 5, 6: dilarang `.then(`
- mengubah nama variabel dari soal
- menggabungkan semua jawaban dalam satu file

---

# 📌 Contoh Hasil Test Berhasil

```bash
npm test
```

```text
================================
Menjalankan semua test Destructuring, Spread, & Async/Await
================================
...
================================
HASIL AKHIR
================================
✅ Semua test LULUS
```
