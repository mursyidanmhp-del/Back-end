-- SOAL 5 — ORDER BY & LIMIT
--
-- Cerita:
-- Data dari database gak selalu urut kayak yang kamu mau. ORDER BY itu
-- cara ngurutin hasilnya, dan LIMIT itu cara batasin cuma ambil
-- beberapa baris teratas aja — kayak bikin "papan peringkat" top 2.
--
-- Ketentuan:
-- - table siswa sudah diisi otomatis oleh test (4 baris data)
-- - ambil kolom nama dan nilai, dari 2 siswa dengan nilai TERTINGGI,
--   urutkan dari yang paling tinggi ke paling rendah
-- - wajib menggunakan SELECT, siswa, ORDER BY, DESC, LIMIT
-- - dilarang menggunakan DROP, DELETE, UPDATE, INSERT, TRUNCATE
--
-- Cara test (jalankan dari folder postgres-query-dasar):
-- npm run test:order-by-limit

-- TODO: tulis query kamu di sini
SELECT nama, nilai FROM siswa
ORDER BY nilai DESC
LIMIT 2;