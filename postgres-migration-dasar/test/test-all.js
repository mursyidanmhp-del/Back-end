const path = require("path");
const { execSync } = require("child_process");

console.log("================================");
console.log("Menjalankan semua test db.js & Migration Dasar");
console.log("================================");

let isAllPassed = true;

const tests = [
  "01-test-db.js",
  "02-test-migration-buat-tabel.js",
  "03-test-migration-tambah-kolom.js",
  "04-test-query-berparameter.js",
];

tests.forEach((testFile) => {
  try {
    execSync(`node "${path.join(__dirname, testFile)}"`, { stdio: "inherit" });
  } catch (error) {
    isAllPassed = false;
  }
});

console.log("================================");
console.log("HASIL AKHIR");
console.log("================================");

if (isAllPassed) {
  console.log("✅ Semua test LULUS");
} else {
  console.log("❌ Masih ada test yang BELUM LULUS");
  process.exit(1);
}
