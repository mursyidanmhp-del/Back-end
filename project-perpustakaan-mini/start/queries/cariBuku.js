/**
 * TUGAS 6 — CARI BUKU (READ + FILTER)
 *
 * - require pool dari "../config/database"
 * - async function cariBuku(kataKunci):
 *   - bikin pola pencarian: "%" + kataKunci + "%" (nempel "%"-nya di
 *     NILAI, bukan di teks query)
 *   - SELECT buku WHERE judul ILIKE $1, pakai pola itu sebagai
 *     parameter, ORDER BY id
 *   - balikin rows-nya
 * - module.exports = cariBuku;
 */

// TODO: tulis kode kamu di sini
