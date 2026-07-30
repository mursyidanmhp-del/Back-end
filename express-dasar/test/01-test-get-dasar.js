const fs = require("fs");
const path = require("path");
const request = require("supertest");
const { stripComments } = require("./strip-comments");

const fileName = "01-get-dasar.js";
const filePath = path.join(__dirname, "..", "soal", fileName);

const requiredWords = ["express", "app.get", "res.send", "module.exports"];
const forbiddenWords = ["app.listen", "app.post", "if (", "for (", "while ("];

console.log("================================");
console.log("Menjalankan test get-dasar.js");
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
    console.log(`❌ get-dasar.js wajib menggunakan "${word}"`);
    isValid = false;
  } else {
    console.log(`✅ menggunakan "${word}"`);
  }
});

let hasListen = false;
forbiddenWords.forEach((word) => {
  if (codeOnly.includes(word)) {
    console.log(`❌ get-dasar.js tidak boleh menggunakan "${word}"`);
    isValid = false;
    if (word === "app.listen") hasListen = true;
  }
});

if (hasListen) {
  console.log("❌ get-dasar.js BELUM LULUS (app.listen terdeteksi, dibatalkan sebelum dijalankan)");
  process.exit(1);
}

async function main() {
  let app;
  try {
    app = require(filePath);
  } catch (err) {
    console.log("❌ get-dasar.js error saat di-require:", err.message);
    process.exit(1);
  }

  try {
    const res = await request(app).get("/");

    if (res.status !== 200) {
      console.log(`❌ Status belum sesuai: diharapkan 200, dapat ${res.status}`);
      isValid = false;
    } else {
      console.log("✅ Status sesuai: 200");
    }

    if (res.text !== "Halo dari Express!") {
      console.log(`❌ Output belum sesuai: diharapkan "Halo dari Express!", dapat "${res.text}"`);
      isValid = false;
    } else {
      console.log('✅ Output sesuai: "Halo dari Express!"');
    }
  } catch (err) {
    console.log("❌ get-dasar.js error saat request:", err.message);
    isValid = false;
  }

  if (isValid) {
    console.log("✅ get-dasar.js LULUS");
    process.exit(0);
  } else {
    console.log("❌ get-dasar.js BELUM LULUS");
    process.exit(1);
  }
}

main();
