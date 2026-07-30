const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { stripComments } = require("./strip-comments");

const fileName = "01-destructuring-object.js";
const filePath = path.join(__dirname, "..", "soal", fileName);

const requiredWords = ["const", "siswa", "{ nama"];
const forbiddenWords = ["let", "var", "function", "if", "for", "while", "siswa.nama", "siswa.nilai"];
const expectedOutputs = ["Andi", "90"];

console.log("================================");
console.log("Menjalankan test destructuring-object.js");
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
    console.log(`❌ destructuring-object.js wajib menggunakan "${word}"`);
    isValid = false;
  } else {
    console.log(`✅ menggunakan "${word}"`);
  }
});

forbiddenWords.forEach((word) => {
  if (codeOnly.includes(word)) {
    console.log(`❌ destructuring-object.js tidak boleh menggunakan "${word}"`);
    isValid = false;
  }
});

let output = "";
try {
  output = execSync(`node "${filePath}"`, { timeout: 5000 }).toString().trim();
} catch (error) {
  console.log("❌ destructuring-object.js error saat dijalankan");
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
  console.log("✅ destructuring-object.js LULUS");
} else {
  console.log("❌ destructuring-object.js BELUM LULUS");
  process.exit(1);
}
