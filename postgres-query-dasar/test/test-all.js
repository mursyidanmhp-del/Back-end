const path = require("path");
const { execSync } = require("child_process");

console.log("================================");
console.log("Menjalankan semua test PostgreSQL Query Dasar");
console.log("================================");

let isAllPassed = true;

const tests = [
  "01-test-create-table.js",
  "02-test-insert-into.js",
  "03-test-select-semua.js",
  "04-test-where-filter.js",
  "05-test-order-by-limit.js",
  "06-test-update-data.js",
  "07-test-delete-data.js",
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
