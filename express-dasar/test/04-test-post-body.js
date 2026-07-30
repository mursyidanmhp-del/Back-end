const fs = require("fs");
const path = require("path");
const request = require("supertest");
const { stripComments } = require("./strip-comments");

const fileName = "04-post-body.js";
const filePath = path.join(__dirname, "..", "soal", fileName);

const requiredWords = ["express", "app.use", "app.post", "req.body", "res.status", "module.exports"];
const forbiddenWords = ["app.listen", "app.get", "if (", "for (", "while ("];

console.log("================================");
console.log("Menjalankan test post-body.js");
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
    console.log(`❌ post-body.js wajib menggunakan "${word}"`);
    isValid = false;
  } else {
    console.log(`✅ menggunakan "${word}"`);
  }
});

if (!/express\s*\.\s*json\s*\(\s*\)/.test(codeOnly)) {
  console.log("❌ post-body.js wajib memasang middleware express.json()");
  isValid = false;
} else {
  console.log("✅ memasang middleware express.json()");
}

let hasListen = false;
forbiddenWords.forEach((word) => {
  if (codeOnly.includes(word)) {
    console.log(`❌ post-body.js tidak boleh menggunakan "${word}"`);
    isValid = false;
    if (word === "app.listen") hasListen = true;
  }
});

if (hasListen) {
  console.log("❌ post-body.js BELUM LULUS (app.listen terdeteksi, dibatalkan sebelum dijalankan)");
  process.exit(1);
}

async function main() {
  let app;
  try {
    app = require(filePath);
  } catch (err) {
    console.log("❌ post-body.js error saat di-require:", err.message);
    process.exit(1);
  }

  try {
    const res = await request(app).post("/buku").send({ judul: "Negeri 5 Menara" });

    if (res.status !== 201) {
      console.log(`❌ Status belum sesuai: diharapkan 201, dapat ${res.status}`);
      isValid = false;
    } else {
      console.log("✅ Status sesuai: 201");
    }

    if (!res.body || res.body.judul !== "Negeri 5 Menara" || res.body.pesan !== "Buku ditambahkan") {
      console.log(`❌ Body belum sesuai, dapat: ${JSON.stringify(res.body)}`);
      isValid = false;
    } else {
      console.log("✅ Body sesuai: judul dan pesan cocok");
    }
  } catch (err) {
    console.log("❌ post-body.js error saat request:", err.message);
    isValid = false;
  }

  if (isValid) {
    console.log("✅ post-body.js LULUS");
    process.exit(0);
  } else {
    console.log("❌ post-body.js BELUM LULUS");
    process.exit(1);
  }
}

main();
