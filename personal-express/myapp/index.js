const express = require("express")
const app = express()
const port = 3000

app.use(express.json())

app.post("/buku", (req, res) => {
    res.status(201).json({
        judul: req.body.judul,
        pesan: "Buku ditambahkan"
    })
})

app.get("/halo", (req, res) => {
    res.status(200).send("Halo world!")
});

app.get("/hi", (req, res) => {
    res.send("hi world!")
});

app.get("/sapa/:nama", (req, res) => {
    res.send("Halo, " + req.params.nama + "!")
});

app.listen(port, () => {
    console.log(`example app listening on port ${port}`);
})

