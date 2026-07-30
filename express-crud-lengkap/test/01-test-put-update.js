const fs = require("fs");
const path = require("path");
const request = require("supertest");
const { stripComments } = require("./strip-comments");

const fileName = "01-put-update.js";
const filePath = path.join(__dirname, "..", "soal", fileName);

const requiredWords = ["express", "app.use", "app.put", "find", "req.params", "req.body", "res.status", "perpustakaan", "module.exports"];
const forbiddenWords = ["app.listen", "app.get", "app.post", "app.delete", "for (", "while ("];

console.log("================================");
console.log("Menjalankan test put-update.js");
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
    console.log(`❌ put-update.js wajib menggunakan "${word}"`);
    isValid = false;
  } else {
    console.log(`✅ menggunakan "${word}"`);
  }
});

let hasListen = false;
forbiddenWords.forEach((word) => {
  if (codeOnly.includes(word)) {
    console.log(`❌ put-update.js tidak boleh menggunakan "${word}"`);
    isValid = false;
    if (word === "app.listen") hasListen = true;
  }
});

if (hasListen) {
  console.log("❌ put-update.js BELUM LULUS (app.listen terdeteksi, dibatalkan sebelum dijalankan)");
  process.exit(1);
}

async function main() {
  let app;
  try {
    app = require(filePath);
  } catch (err) {
    console.log("❌ put-update.js error saat di-require:", err.message);
    process.exit(1);
  }

  try {
    const res = await request(app).put("/buku/2").send({ judul: "Bumi Manusia Baru" });

    if (res.status !== 200) {
      console.log(`❌ Status belum sesuai: diharapkan 200, dapat ${res.status}`);
      isValid = false;
    } else {
      console.log("✅ Status sesuai: 200");
    }

    if (res.body.id !== 2 || res.body.judul !== "Bumi Manusia Baru") {
      console.log(`❌ Body belum sesuai, dapat: ${JSON.stringify(res.body)}`);
      isValid = false;
    } else {
      console.log("✅ Body sesuai: id dan judul ter-update");
    }
  } catch (err) {
    console.log("❌ put-update.js error saat request:", err.message);
    isValid = false;
  }

  if (isValid) {
    console.log("✅ put-update.js LULUS");
    process.exit(0);
  } else {
    console.log("❌ put-update.js BELUM LULUS");
    process.exit(1);
  }
}

main();
