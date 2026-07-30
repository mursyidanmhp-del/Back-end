const fs = require("fs");
const path = require("path");
const request = require("supertest");
const { stripComments } = require("./strip-comments");

const fileName = "02-delete.js";
const filePath = path.join(__dirname, "..", "soal", fileName);

const requiredWords = ["express", "app.delete", "filter", "req.params", "res.status", "perpustakaan", "module.exports"];
const forbiddenWords = ["app.listen", "app.get", "app.post", "app.put", "splice", "for (", "while ("];

console.log("================================");
console.log("Menjalankan test delete.js");
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
    console.log(`❌ delete.js wajib menggunakan "${word}"`);
    isValid = false;
  } else {
    console.log(`✅ menggunakan "${word}"`);
  }
});

let hasListen = false;
forbiddenWords.forEach((word) => {
  if (codeOnly.includes(word)) {
    console.log(`❌ delete.js tidak boleh menggunakan "${word}"`);
    isValid = false;
    if (word === "app.listen") hasListen = true;
  }
});

if (hasListen) {
  console.log("❌ delete.js BELUM LULUS (app.listen terdeteksi, dibatalkan sebelum dijalankan)");
  process.exit(1);
}

async function main() {
  let app;
  try {
    app = require(filePath);
  } catch (err) {
    console.log("❌ delete.js error saat di-require:", err.message);
    process.exit(1);
  }

  try {
    const res = await request(app).delete("/buku/1");

    if (res.status !== 200) {
      console.log(`❌ Status belum sesuai: diharapkan 200, dapat ${res.status}`);
      isValid = false;
    } else {
      console.log("✅ Status sesuai: 200");
    }

    if (res.body.pesan !== "Buku dihapus" || res.body.sisa !== 1) {
      console.log(`❌ Body belum sesuai, dapat: ${JSON.stringify(res.body)}`);
      isValid = false;
    } else {
      console.log("✅ Body sesuai: pesan dan sisa cocok (array beneran menyusut)");
    }
  } catch (err) {
    console.log("❌ delete.js error saat request:", err.message);
    isValid = false;
  }

  if (isValid) {
    console.log("✅ delete.js LULUS");
    process.exit(0);
  } else {
    console.log("❌ delete.js BELUM LULUS");
    process.exit(1);
  }
}

main();
