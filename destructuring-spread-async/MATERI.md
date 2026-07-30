# 📘 Materi — Destructuring, Spread, & Async/Await

> 🎯 **Materi ini didesain biar kamu (pengajar) bisa langsung ngajarin
> cuma dengan SEKALI baca.** Tiap bagian ada skrip "cara ngomonginnya"
> ke murid — tinggal ikutin alurnya.

Baca ini dulu sebelum mengajar / mengerjakan latihan.

Ini modul JEMBATAN — bukan materi baru yang berdiri sendiri, tapi 3
kebiasaan penulisan kode modern yang bakal dipakai TERUS-MENERUS mulai
sekarang: di Express (yang kemarin), di database (yang bentar lagi),
sampai di React (nanti). Kalau ini gak solid, murid bakal keteteran
bukan karena gak paham LOGIKA-nya, tapi karena gak ngerti SINTAKS yang
dipakai buat nulis logika itu.

---

## 🎬 Buka dengan Analogi Ini: Ambil Barang dari Kardus

Bayangin kamu dikasih SATU KARDUS BESAR isinya banyak barang. Selama
ini, tiap mau ambil satu barang, kamu buka kardusnya, cari, ambil satu,
tutup lagi, ulang buat barang berikutnya. **Destructuring** itu kayak
"Bilang ke orang yang megang kardus: 'tolong ambilin baju sama sepatu
sekalian' — LANGSUNG dapet dua-duanya dalam satu kali ambil."

**Spread** itu beda lagi: itu kayak "foto-in isi kardus, terus bikin
kardus BARU dari hasil foto itu plus satu barang tambahan — kardus
ASLINYA gak disentuh sama sekali."

**Promise & async/await** itu tentang WAKTU: kadang kamu minta tolong
orang lain ambilin barang dari gudang yang jauh — gak instan, ada jeda
nunggu. Promise itu "surat janji" yang bakal dikasih HASIL-nya begitu
udah selesai, bukan sekarang.

> 🎤 **Cara buka sesi:** *"Hari ini kita gak belajar konsep logika
> baru — kita belajar cara NULIS kode yang lebih rapi buat hal yang
> udah kamu bisa. Bayangin kamu dikasih kardus isi banyak barang..."*

---

## 1️⃣ Destructuring Object — Ambil Beberapa Sekaligus

```js
const siswa = { nama: "Andi", kelas: "12 IPA", nilai: 90 };

// Cara LAMA (satu-satu):
const nama1 = siswa.nama;
const nilai1 = siswa.nilai;

// Cara BARU (destructuring, satu baris):
const { nama, nilai } = siswa;
```

- Nama variabel di `{ nama, nilai }` HARUS SAMA PERSIS dengan nama
  property di object aslinya. Kalau propertynya `nilai`, variabelnya
  juga harus `nilai` (bukan bebas milih nama sendiri, beda sama
  destructuring array).

> 🎤 **Cara ngomonginnya:** *"`const { nama, nilai } = siswa` itu
> artinya: 'dari siswa, ambil yang namanya nama sama nilai, taruh di
> variabel dengan nama yang SAMA.' Ini bukan bikin object baru — ini
> cuma cara ambil isi doang."*

---

## 2️⃣ Destructuring Array — Boleh Skip Elemen

```js
const ranking = ["Budi", "Sari", "Rina"];

// Ambil elemen ke-1 dan ke-3, LOMPATI elemen ke-2:
const [juara1, , juara3] = ranking;
```

- Beda sama object, di array KAMU BEBAS kasih nama variabel apa aja —
  urutannya yang nentuin, bukan namanya.
- Koma kosong (`, ,`) itu cara bilang "lewatin posisi ini, gak usah
  diambil."

> 🎤 **Cara ngomonginnya:** *"Kalau destructuring object itu 'ambil
> yang namanya ini,' destructuring array itu 'ambil yang POSISINYA
> ini.' Koma kosong itu kayak bilang 'yang ini lewat aja, gak usah.'"*

---

## 3️⃣ Spread Operator — Copy Tanpa Mengubah Aslinya

```js
const belanja = ["Roti", "Susu"];

// SALAH kalau mau jaga data asli (push MENGUBAH array asli):
belanja.push("Telur");

// BENAR — bikin array BARU, yang lama gak disentuh:
const belanjaBaru = [...belanja, "Telur"];
```

- Titik tiga (`...`) itu artinya "bongkar semua isinya di sini."
- `[...belanja, "Telur"]` = "bongkar semua isi `belanja`, taruh di
  sini, terus tambahin `"Telur"` di belakangnya" — hasilnya array BARU
  yang terpisah dari `belanja`.

> ⚠️ **Kenapa ini penting banget (bukan cuma gaya-gayaan):** Nanti di
> React, DILARANG KERAS mengubah data asli langsung (`push`,
> `.property = ...`) — harus selalu bikin salinan baru pakai spread.
> Kalau kebiasaan ini gak dilatih dari sekarang, nanti di React bakal
> muncul bug aneh yang susah dilacak.

> 🎤 **Cara ngomonginnya:** *"Bayangin `belanja` itu draft asli yang
> mau kamu SIMPAN buat dibandingin nanti. Spread itu cara bikin
> FOTOKOPI-nya plus tambahan, draft aslinya tetep utuh gak kesentuh."*

---

## 4️⃣ Promise — "Surat Janji" Buat Hasil yang Belum Ada Sekarang

```js
function ambilData() {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve("Data siswa: Budi");
    }, 100);
  });
}

ambilData().then(function (hasil) {
  console.log(hasil);
});
```

- `new Promise(...)` itu bikin "surat janji". Di dalamnya ada
  `setTimeout` yang nyimulasiin PROSES NUNGGU (di dunia nyata, ini
  biasanya nunggu jawaban dari database atau server lain).
- `resolve(...)` itu momen "janjinya ditepatin" — hasil akhirnya
  dikasih di sini.
- `.then(...)` itu cara BACA hasil janji itu SETELAH beneran selesai
  (bukan sebelum).

> 🎤 **Cara ngomonginnya:** *"`new Promise` itu kamu nyuruh orang lain
> ambil barang dari gudang jauh, dia janji bakal kasih tau begitu
> udah ketemu. `resolve(...)` itu pas dia bilang 'nih ketemu, ini
> barangnya.' `.then(...)` itu cara kamu 'nunggu dia selesai, baru
> lakuin sesuatu sama barangnya.'"*

---

## 5️⃣ Async/Await — Cara BACA Promise yang Lebih Rapi

```js
function ambilData() {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve("Data siswa: Budi");
    }, 100);
  });
}

async function main() {
  const hasil = await ambilData();
  console.log(hasil);
}

main();
```

- **PENTING:** ini BUKAN cara baru bikin Promise — cara BIKIN-nya
  (`new Promise`, `resolve`) TETEP SAMA. Yang beda cuma cara MANGGIL/
  MEMBACA hasilnya.
- `async` di depan function artinya "function ini boleh pakai
  `await` di dalamnya."
- `await` artinya "berhenti dulu di sini, tunggu sampai Promise ini
  beneran selesai, baru lanjut ke baris berikutnya." Kodenya jadi
  kebaca dari atas ke bawah kayak alur biasa — gak numpuk `.then()`.

> 🎤 **Cara ngomonginnya:** *"`.then()` itu kayak nitip pesan 'kalau
> udah selesai, tolong lakuin ini.' `await` itu kamu BERDIRI NUNGGU di
> depan sampai selesai, baru lanjut jalan. Hasil akhirnya SAMA, tapi
> `await` bikin kodenya kebaca kayak cerita biasa, gak melompat-lompat."*

---

## 6️⃣ Gabungan: Async/Await + Destructuring

Ini pola yang bakal KETEMU TERUS di Express (dan nanti di database):

```js
function ambilUser() {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve({ nama: "Dinda", umur: 21 });
    }, 100);
  });
}

async function main() {
  const { nama, umur } = await ambilUser();
  console.log(nama);
  console.log(umur);
}

main();
```

> 🎤 **Cara nutup sesi:** *"Lihat kan? `await ambilUser()` ngasih
> object balik, terus LANGSUNG kita destructuring di baris yang sama
> — gak perlu simpan ke variabel sementara dulu. Ini pola yang bakal
> kamu tulis TERUS pas ambil data dari database nanti: `await`, hasil-
> nya object, langsung destructuring."*

---

## ✅ Ringkasan

| Istilah | Artinya |
|---|---|
| **Destructuring object** | `const { a, b } = obj` — ambil berdasarkan NAMA property |
| **Destructuring array** | `const [a, , c] = arr` — ambil berdasarkan POSISI, boleh skip |
| **Spread (`...`)** | Bongkar isi array/object buat bikin SALINAN BARU tanpa mengubah aslinya |
| **`new Promise`** | "Surat janji" hasil yang baru ada NANTI, bukan sekarang |
| **`resolve(...)`** | Momen Promise-nya beres, ngasih hasil akhir |
| **`.then(...)`** | Cara LAMA baca hasil Promise |
| **`async`/`await`** | Cara BARU (lebih rapi) baca hasil Promise yang sama |

---

## 🧠 Cek Paham Sebelum Lanjut ke Soal

1. *"Bedanya destructuring object sama destructuring array apa?"*
2. *"Kenapa kita pakai spread (`...belanja`), bukan langsung
   `belanja.push(...)`?"*
3. *"`.then()` sama `await` itu beda konsep atau cuma beda cara nulis
   buat hal yang sama?"*

Kalau 3 ini kejawab lancar, lanjut ke latihan di folder `soal/`.
