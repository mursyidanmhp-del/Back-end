const path = require("path");
const { execSync } = require("child_process");

console.log("================================");
console.log("Menjalankan semua test Destructuring, Spread, & Async/Await");
console.log("================================");

let isAllPassed = true;

const tests = [
  "01-test-destructuring-object.js",
  "02-test-destructuring-array.js",
  "03-test-spread-operator.js",
  "04-test-promise-dasar.js",
  "05-test-async-await-dasar.js",
  "06-test-gabungan.js"
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
