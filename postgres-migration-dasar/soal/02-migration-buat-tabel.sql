-- SOAL 2 — MIGRATION: BUAT TABEL
--
-- Cerita:
-- Ini migration PERTAMA di project ini — isinya SATU perubahan
-- struktur: bikin tabel baru. Nanti file ini dijalanin lewat runner
-- (test/migrate.js), BUKAN diketik manual ke psql.
--
-- Ketentuan:
-- - buat table bernama buku dengan kolom:
--   1. id     -> SERIAL, PRIMARY KEY
--   2. judul  -> VARCHAR(100), NOT NULL
--   3. penulis -> VARCHAR(100)
-- - wajib menggunakan CREATE TABLE, SERIAL, PRIMARY KEY, VARCHAR, NOT NULL
-- - dilarang menggunakan DROP TABLE, DROP DATABASE, TRUNCATE, ALTER TABLE
--
-- Cara test (jalankan dari folder postgres-migration-dasar):
-- npm run test:migration-buat-tabel

-- TODO: tulis query kamu di sini
CREATE TABLE buku (
    id SERIAL PRIMARY KEY,
    judul VARCHAR (100) NOT NULL,
    penulis VARCHAR (100)
);