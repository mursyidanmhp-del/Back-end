-- SOAL 6 — UPDATE (UBAH DATA)
--
-- Cerita:
-- Data yang udah ke-insert bukan berarti gak bisa diubah lagi. UPDATE
-- itu cara ubah data yang SUDAH ADA. Ini yang PALING BAHAYA kalau lupa
-- WHERE — tanpa WHERE, SEMUA baris ke-update, bukan cuma satu.
--
-- Ketentuan:
-- - table siswa sudah diisi otomatis oleh test (4 baris data, termasuk
--   Budi dengan nilai 75)
-- - ubah nilai milik siswa bernama "Budi" jadi 95
-- - WAJIB pakai WHERE supaya CUMA Budi yang berubah, siswa lain jangan
--   ikut berubah
-- - wajib menggunakan UPDATE, siswa, SET, nilai, WHERE, Budi
-- - dilarang menggunakan DROP, DELETE, INSERT, TRUNCATE
--
-- Cara test (jalankan dari folder postgres-query-dasar):
-- npm run test:update-data

-- TODO: tulis query kamu di sini
UPDATE siswa SET nilai = 95
WHERE nama = 'Budi'