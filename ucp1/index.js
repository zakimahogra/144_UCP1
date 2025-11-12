const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const host = process.env.HOST || '127.0.0.1';

const db = require('./models');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.post('/produk', async (req, res) => {
  const { nama_produk, harga, stok, kategori, tanggal_rilis } = req.body;
  
  if (!nama_produk || !harga) {
    return res.status(400).json({ error: 'nama_produk dan harga wajib diisi' });
  }

  try {
    const produkBaru = await db.produk.create({
      nama_produk,
      harga,
      stok,
      kategori,
      tanggal_rilis
    });
    res.status(201).json(produkBaru);
  } catch (error) {
    console.error('POST /produk error:', error);
    res.status(500).json({ error: 'Gagal menambahkan produk', details: error.message });
  }
});
