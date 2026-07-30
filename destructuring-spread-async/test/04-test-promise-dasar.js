const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { stripComments } = require("./strip-comments");

const fileName = "04-promise-dasar.js";
const filePath = path.join(__dirname, "..", "soal", fileName);

const requiredWords = ["function ambilData", "new Promise", "setTimeout", "resolve(", ".then("];
const forbiddenWords = ["async", "await"];
const expectedOutputs = ["Data siswa: Budi"];

console.log("================================");
console.log("Menjalankan test promise-dasar.js");
console.log("================================");

if (!fs.existsSync(filePath)) {
  console.log(`❌ File ${fileName} tidak ditemukan`);
  process.exit(1);
}

const code = fs.readFileSync(filePath, "utf8");
const codeOnly = stripComments(code);

let isValid = true;

requiredWords.forEach((word) => {
  if (!codeOnly.includes(word)) {
    console.log(`❌ promise-dasar.js wajib menggunakan "${word}"`);
    isValid = false;
  } else {
    console.log(`✅ menggunakan "${word}"`);
  }
});

forbiddenWords.forEach((word) => {
  if (codeOnly.includes(word)) {
    console.log(`❌ promise-dasar.js tidak boleh menggunakan "${word}"`);
    isValid = false;
  }
});

let output = "";
try {
  output = execSync(`node "${filePath}"`, { timeout: 5000 }).toString().trim();
} catch (error) {
  console.log("❌ promise-dasar.js error saat dijalankan");
  process.exit(1);
}

const outputLines = output.split("\n").map((line) => line.trim());

expectedOutputs.forEach((expectedText) => {
  if (!outputLines.includes(expectedText)) {
    console.log(`❌ Output belum sesuai: ${expectedText}`);
    isValid = false;
  } else {
    console.log(`✅ Output sesuai: ${expectedText}`);
  }
});

if (isValid) {
  console.log("✅ promise-dasar.js LULUS");
} else {
  console.log("❌ promise-dasar.js BELUM LULUS");
  process.exit(1);
}
