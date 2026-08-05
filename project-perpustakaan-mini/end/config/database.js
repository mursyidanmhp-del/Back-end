// config/database.js
//
// Ini SATU-SATUNYA tempat di seluruh project yang bikin koneksi ke
// PostgreSQL. Semua file lain (queries/, db/seeders/, index.js) TINGGAL
// require file ini, gak ada yang bikin koneksi sendiri-sendiri.
//
// Kenapa penting dipisah gini? Karena kalau nanti pindah dari "MVC
// sederhana" ke project yang lebih besar, model/controller yang butuh
// akses database tinggal `require("../config/database")` — gak perlu
// tau caranya connect, cukup tau "pool" itu ada dan siap dipakai.

const { Pool } = require("pg");

// new Pool({...}), BUKAN new Client({...}) — bedanya:
// - Client   = SATU sambungan doang. Kalau ada 2 query jalan
//              bersamaan, salah satunya harus ANTRE.
// - Pool     = KOLAM berisi beberapa sambungan sekaligus. Library
//              `pg` yang ngatur otomatis mana yang lagi kosong buat
//              dipinjem. Ini WAJIB dipakai buat aplikasi (bukan
//              latihan sekali-jalan), karena aplikasi beneran bakal
//              nerima banyak request bersamaan.
const pool = new Pool({
  // Semua nilai config diambil dari process.env (isinya dari file
  // .env, di-load pakai require("dotenv").config() di index.js).
  // TIDAK ditulis manual di sini — kalau ditulis manual, tiap orang
  // yang jalanin project ini (murid lain, server production) harus
  // ENGUBAH KODE buat sesuain kredensial mereka. Dengan .env, mereka
  // tinggal ganti isi file .env, kode-nya gak disentuh sama sekali.
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT), // .env selalu berupa teks ("5432"), makanya di-convert ke Number
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
});

// module.exports = pool (BUKAN sebuah function atau class) — jadi
// waktu file lain manggil `const pool = require("./config/database")`,
// mereka dapet POOL YANG SAMA PERSIS, bukan bikin pool baru tiap kali
// di-require. Ini penting: cuma ada SATU kolam koneksi buat seluruh
// aplikasi, dipakai bareng-bareng oleh semua query.
module.exports = pool;
