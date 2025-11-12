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

app.get('/produk', async (req, res) => {
  try {
    const semuaProduk = await db.produk.findAll();
    res.status(200).json(semuaProduk);
  } catch (error) {
    console.error('GET /produk error:', error);
    res.status(500).json({ error: 'Gagal mengambil data produk' });
  }
});


app.get('/produk/:id', async (req, res) => {
  const produkId = req.params.id;
  try {
    const produk = await db.produk.findByPk(produkId);
    if (!produk) {
      return res.status(404).json({ error: 'Produk tidak ditemukan' });
    }
    res.status(200).json(produk);
  } catch (error) {
    console.error(`GET /produk/${produkId} error:`, error);
    res.status(500).json({ error: 'Gagal mengambil data produk' });
  }
});

app.put('/produk/:id', async (req, res) => {
  const produkId = req.params.id;
  const { nama_produk, harga, stok, kategori, tanggal_rilis } = req.body;

  try {
    const produk = await db.produk.findByPk(produkId);
    if (!produk) {
      return res.status(404).json({ error: 'Produk tidak ditemukan' });
    }

    await produk.update({
      nama_produk,
      harga,
      stok,
      kategori,
      tanggal_rilis
    });
    
    res.status(200).json(produk);
  } catch (error) {
    console.error(`PUT /produk/${produkId} error:`, error);
    res.status(500).json({ error: 'Gagal memperbarui data produk' });
  }
});

app.delete('/produk/:id', async (req, res) => {
  const produkId = req.params.id;
  try {
    const produk = await db.produk.findByPk(produkId);
    if (!produk) {
      return res.status(404).json({ error: 'Produk tidak ditemukan' });
    }

    await produk.destroy();
    res.status(200).json({ message: 'Produk berhasil dihapus' });
  } catch (error) {
    console.error(`DELETE /produk/${produkId} error:`, error);
    res.status(500).json({ error: 'Gagal menghapus data produk' });
  }
});

