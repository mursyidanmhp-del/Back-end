const fs = require("fs");
const path = require("path");
const request = require("supertest");
const { stripComments } = require("./strip-comments");

const fileName = "05-crud-buku.js";
const filePath = path.join(__dirname, "..", "soal", fileName);

const requiredWords = [
  "express", "app.use", "app.get", "app.post", "find", "push",
  "req.params", "req.body", "res.status", "perpustakaan", "module.exports",
];
const forbiddenWords = ["app.listen", "while ("];

console.log("================================");
console.log("Menjalankan test crud-buku.js");
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
    console.log(`❌ crud-buku.js wajib menggunakan "${word}"`);
    isValid = false;
  } else {
    console.log(`✅ menggunakan "${word}"`);
  }
});

let hasListen = false;
forbiddenWords.forEach((word) => {
  if (codeOnly.includes(word)) {
    console.log(`❌ crud-buku.js tidak boleh menggunakan "${word}"`);
    isValid = false;
    if (word === "app.listen") hasListen = true;
  }
});

if (hasListen) {
  console.log("❌ crud-buku.js BELUM LULUS (app.listen terdeteksi, dibatalkan sebelum dijalankan)");
  process.exit(1);
}

async function main() {
  let app;
  try {
    app = require(filePath);
  } catch (err) {
    console.log("❌ crud-buku.js error saat di-require:", err.message);
    process.exit(1);
  }

  try {
    const resAll = await request(app).get("/buku");
    if (resAll.status !== 200 || !Array.isArray(resAll.body) || resAll.body.length !== 2) {
      console.log(`❌ GET /buku belum sesuai, dapat: ${resAll.status} ${JSON.stringify(resAll.body)}`);
      isValid = false;
    } else {
      console.log("✅ GET /buku sesuai (200, 2 buku)");
    }

    const resOne = await request(app).get("/buku/2");
    if (resOne.status !== 200 || !resOne.body || resOne.body.judul !== "Bumi Manusia") {
      console.log(`❌ GET /buku/2 belum sesuai, dapat: ${resOne.status} ${JSON.stringify(resOne.body)}`);
      isValid = false;
    } else {
      console.log("✅ GET /buku/2 sesuai (Bumi Manusia)");
    }

    const resPost = await request(app).post("/buku").send({ judul: "Laut Bercerita" });
    if (resPost.status !== 201 || !resPost.body || resPost.body.judul !== "Laut Bercerita" || resPost.body.id !== 3) {
      console.log(`❌ POST /buku belum sesuai, dapat: ${resPost.status} ${JSON.stringify(resPost.body)}`);
      isValid = false;
    } else {
      console.log("✅ POST /buku sesuai (201, id 3, Laut Bercerita)");
    }
  } catch (err) {
    console.log("❌ crud-buku.js error saat request:", err.message);
    isValid = false;
  }

  if (isValid) {
    console.log("✅ crud-buku.js LULUS");
    process.exit(0);
  } else {
    console.log("❌ crud-buku.js BELUM LULUS");
    process.exit(1);
  }
}

main();
