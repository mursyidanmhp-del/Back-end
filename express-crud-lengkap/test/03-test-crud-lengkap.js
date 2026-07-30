const fs = require("fs");
const path = require("path");
const request = require("supertest");
const { stripComments } = require("./strip-comments");

const fileName = "03-crud-lengkap.js";
const filePath = path.join(__dirname, "..", "soal", fileName);

const requiredWords = [
  "express", "app.use", "app.get", "app.post", "app.put", "app.delete",
  "find", "filter", "push", "req.params", "req.body", "res.status",
  "perpustakaan", "module.exports"
];
const forbiddenWords = ["app.listen", "for (", "while ("];

console.log("================================");
console.log("Menjalankan test crud-lengkap.js");
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
    console.log(`❌ crud-lengkap.js wajib menggunakan "${word}"`);
    isValid = false;
  } else {
    console.log(`✅ menggunakan "${word}"`);
  }
});

let hasListen = false;
forbiddenWords.forEach((word) => {
  if (codeOnly.includes(word)) {
    console.log(`❌ crud-lengkap.js tidak boleh menggunakan "${word}"`);
    isValid = false;
    if (word === "app.listen") hasListen = true;
  }
});

if (hasListen) {
  console.log("❌ crud-lengkap.js BELUM LULUS (app.listen terdeteksi, dibatalkan sebelum dijalankan)");
  process.exit(1);
}

async function main() {
  let app;
  try {
    app = require(filePath);
  } catch (err) {
    console.log("❌ crud-lengkap.js error saat di-require:", err.message);
    process.exit(1);
  }

  try {
    const getAll = await request(app).get("/buku");
    if (getAll.status !== 200 || !Array.isArray(getAll.body) || getAll.body.length !== 2) {
      console.log(`❌ GET /buku belum sesuai, dapat: ${getAll.status} ${JSON.stringify(getAll.body)}`);
      isValid = false;
    } else {
      console.log("✅ GET /buku sesuai (200, 2 buku)");
    }

    const post = await request(app).post("/buku").send({ judul: "Laut Bercerita" });
    if (post.status !== 201 || post.body.id !== 3 || post.body.judul !== "Laut Bercerita") {
      console.log(`❌ POST /buku belum sesuai, dapat: ${post.status} ${JSON.stringify(post.body)}`);
      isValid = false;
    } else {
      console.log("✅ POST /buku sesuai (201, id 3, Laut Bercerita)");
    }

    const getOne = await request(app).get("/buku/3");
    if (getOne.status !== 200 || getOne.body.id !== 3 || getOne.body.judul !== "Laut Bercerita") {
      console.log(`❌ GET /buku/3 belum sesuai, dapat: ${getOne.status} ${JSON.stringify(getOne.body)}`);
      isValid = false;
    } else {
      console.log("✅ GET /buku/3 sesuai (Laut Bercerita)");
    }

    const put = await request(app).put("/buku/3").send({ judul: "Laut Bercerita Edisi 2" });
    if (put.status !== 200 || put.body.id !== 3 || put.body.judul !== "Laut Bercerita Edisi 2") {
      console.log(`❌ PUT /buku/3 belum sesuai, dapat: ${put.status} ${JSON.stringify(put.body)}`);
      isValid = false;
    } else {
      console.log("✅ PUT /buku/3 sesuai (Laut Bercerita Edisi 2)");
    }

    const del = await request(app).delete("/buku/1");
    if (del.status !== 200 || del.body.pesan !== "Buku dihapus" || del.body.sisa !== 2) {
      console.log(`❌ DELETE /buku/1 belum sesuai, dapat: ${del.status} ${JSON.stringify(del.body)}`);
      isValid = false;
    } else {
      console.log("✅ DELETE /buku/1 sesuai (201, sisa 2 buku)");
    }
  } catch (err) {
    console.log("❌ crud-lengkap.js error saat request:", err.message);
    isValid = false;
  }

  if (isValid) {
    console.log("✅ crud-lengkap.js LULUS");
    process.exit(0);
  } else {
    console.log("❌ crud-lengkap.js BELUM LULUS");
    process.exit(1);
  }
}

main();
