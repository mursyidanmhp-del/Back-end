const path = require("path");
const { execSync } = require("child_process");

console.log("================================");
console.log("Menjalankan semua test Express Dasar");
console.log("================================");

let isAllPassed = true;

const tests = [
  "01-test-get-dasar.js",
  "02-test-route-param.js",
  "03-test-query-string.js",
  "04-test-post-body.js",
  "05-test-crud-buku.js"
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
