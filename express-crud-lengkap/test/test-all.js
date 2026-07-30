const path = require("path");
const { execSync } = require("child_process");

console.log("================================");
console.log("Menjalankan semua test Express CRUD Lengkap");
console.log("================================");

let isAllPassed = true;

const tests = [
  "01-test-put-update.js",
  "02-test-delete.js",
  "03-test-crud-lengkap.js"
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
