const fs = require("fs");
const path = require("path");
const request = require("supertest");
const { stripComments } = require("./strip-comments");

const fileName = "02-route-param.js";
const filePath = path.join(__dirname, "..", "soal", fileName);

const requiredWords = ["express", "app.get", "req.params", "res.send", "module.exports"];
const forbiddenWords = ["app.listen", "app.post", "if (", "for (", "while ("];

console.log("================================");
console.log("Menjalankan test route-param.js");
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
    console.log(`❌ route-param.js wajib menggunakan "${word}"`);
    isValid = false;
  } else {
    console.log(`✅ menggunakan "${word}"`);
  }
});

if (!/["']\/sapa\/:nama["']/.test(codeOnly)) {
  console.log('❌ route-param.js wajib mendaftarkan route "/sapa/:nama"');
  isValid = false;
} else {
  console.log('✅ mendaftarkan route "/sapa/:nama"');
}

let hasListen = false;
forbiddenWords.forEach((word) => {
  if (codeOnly.includes(word)) {
    console.log(`❌ route-param.js tidak boleh menggunakan "${word}"`);
    isValid = false;
    if (word === "app.listen") hasListen = true;
  }
});

if (hasListen) {
  console.log("❌ route-param.js BELUM LULUS (app.listen terdeteksi, dibatalkan sebelum dijalankan)");
  process.exit(1);
}

async function main() {
  let app;
  try {
    app = require(filePath);
  } catch (err) {
    console.log("❌ route-param.js error saat di-require:", err.message);
    process.exit(1);
  }

  try {
    const res = await request(app).get("/sapa/Budi");

    if (res.status !== 200) {
      console.log(`❌ Status belum sesuai: diharapkan 200, dapat ${res.status}`);
      isValid = false;
    } else {
      console.log("✅ Status sesuai: 200");
    }

    if (res.text !== "Halo, Budi!") {
      console.log(`❌ Output belum sesuai: diharapkan "Halo, Budi!", dapat "${res.text}"`);
      isValid = false;
    } else {
      console.log('✅ Output sesuai: "Halo, Budi!"');
    }
  } catch (err) {
    console.log("❌ route-param.js error saat request:", err.message);
    isValid = false;
  }

  if (isValid) {
    console.log("✅ route-param.js LULUS");
    process.exit(0);
  } else {
    console.log("❌ route-param.js BELUM LULUS");
    process.exit(1);
  }
}

main();
