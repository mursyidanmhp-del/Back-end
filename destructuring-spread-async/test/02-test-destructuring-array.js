const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { stripComments } = require("./strip-comments");

const fileName = "02-destructuring-array.js";
const filePath = path.join(__dirname, "..", "soal", fileName);

const requiredWords = ["const", "ranking", "[juara1"];
const forbiddenWords = ["let", "var", "function", "if", "for", "while", "ranking[0]", "ranking[2]"];
const expectedOutputs = ["Budi", "Rina"];

console.log("================================");
console.log("Menjalankan test destructuring-array.js");
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
    console.log(`❌ destructuring-array.js wajib menggunakan "${word}"`);
    isValid = false;
  } else {
    console.log(`✅ menggunakan "${word}"`);
  }
});

if (!/\[\s*juara1\s*,\s*,\s*juara3\s*\]/.test(codeOnly)) {
  console.log("❌ destructuring-array.js wajib melompati elemen kedua: [juara1, , juara3]");
  isValid = false;
} else {
  console.log("✅ melompati elemen kedua dengan benar");
}

forbiddenWords.forEach((word) => {
  if (codeOnly.includes(word)) {
    console.log(`❌ destructuring-array.js tidak boleh menggunakan "${word}"`);
    isValid = false;
  }
});

let output = "";
try {
  output = execSync(`node "${filePath}"`, { timeout: 5000 }).toString().trim();
} catch (error) {
  console.log("❌ destructuring-array.js error saat dijalankan");
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
  console.log("✅ destructuring-array.js LULUS");
} else {
  console.log("❌ destructuring-array.js BELUM LULUS");
  process.exit(1);
}
