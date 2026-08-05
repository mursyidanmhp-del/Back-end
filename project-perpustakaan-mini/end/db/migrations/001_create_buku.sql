-- Migration #001 — bikin tabel buku.
-- Ini migration PERTAMA di project ini, makanya nomornya 001.
-- File ini dijalanin OTOMATIS lewat db/migrate.js, bukan diketik
-- manual ke psql.

CREATE TABLE buku (
  -- SERIAL = angka yang otomatis nambah sendiri (1, 2, 3, ...).
  -- PRIMARY KEY = ID unik tiap baris, gak boleh kembar/kosong.
  -- Gabungan ini = "nomor urut otomatis yang jadi identitas baris."
  id SERIAL PRIMARY KEY,

  -- VARCHAR(100) = teks pendek, maksimal 100 karakter.
  -- NOT NULL = WAJIB diisi — gak masuk akal ada buku tanpa judul.
  judul VARCHAR(100) NOT NULL,

  -- Beda dari judul: penulis BOLEH kosong (misal buku anonim/gak
  -- diketahui penulisnya) — makanya gak ada NOT NULL di sini.
  penulis VARCHAR(100),

  -- INTEGER biasa — tahun cukup disimpen sebagai angka bulat,
  -- gak butuh tipe TIMESTAMP (itu buat tanggal+jam lengkap).
  tahun_terbit INTEGER,

  -- DEFAULT 0 = kalau pas INSERT kolom ini gak diisi, otomatis
  -- dianggap 0 (bukan NULL). Masuk akal: buku baru ditambah,
  -- defaultnya "belum ada stok" sampai diisi manual.
  stok INTEGER DEFAULT 0
);
