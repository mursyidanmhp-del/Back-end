CREATE TABLE buku (
  id SERIAL PRIMARY KEY,
  judul VARCHAR(100) NOT NULL,
  penulis VARCHAR(100),
  tahun_terbit INTEGER,
  stok INTEGER DEFAULT 0
);
