/**
 * SOAL 1 — db.js: CONNECTION POOL
 *
 * Cerita:
 * Selama ini kamu connect ke database manual lewat psql. Sekarang
 * bikin file KONEKSI yang bisa dipakai ulang dari kode JavaScript —
 * ini pola yang bakal kamu pakai TERUS mulai sekarang di setiap
 * project Express + PostgreSQL.
 *
 * Ketentuan:
 * - require("pg"), ambil Pool dari situ
 * - buat pool baru pakai "new Pool({...})", config-nya WAJIB diambil
 *   dari process.env (bukan ditulis manual), pakai key ini persis:
 *   - host: process.env.PGHOST
 *   - port: Number(process.env.PGPORT)
 *   - user: process.env.PGUSER
 *   - password: process.env.PGPASSWORD
 *   - database: process.env.PGDATABASE
 * - WAJIB: module.exports = pool; di baris paling akhir
 * - wajib menggunakan require("pg"), new Pool, process.env.PGHOST,
 *   process.env.PGUSER, process.env.PGPASSWORD, process.env.PGDATABASE,
 *   module.exports
 * - dilarang menggunakan new Client (harus Pool, bukan Client satu-satu)
 *
 * Cara test (jalankan dari folder postgres-migration-dasar):
 * npm run test:db
 */

// TODO: tulis kode kamu di sini
