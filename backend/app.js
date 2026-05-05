require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Tambahkan cors jika belum ada
const { sequelize } = require('./models'); // Sesuaikan dengan cara Anda import model

const app = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE (WAJIB DI SINI) ---
app.use(cors());
app.use(express.json()); // Ini yang paling penting agar bisa baca body POST
app.use(express.urlencoded({ extended: true }));

// --- ROUTES ---
app.use("/menu", require("./routes/menuRoutes"));
app.use("/tables", require("./routes/tableRoutes"));

// TAMBAHKAN BARIS INI:
app.use("/orders", require("./routes/orderRoutes")); 

// Rute tes tetap bisa dipertahankan
app.post("/test-post", (req, res) => {
  res.json({ message: "POST berhasil sampai ke app.js!", data: req.body });
});

// --- DATABASE & SERVER ---
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Koneksi database berhasil!');
    
    await sequelize.sync(); 

    app.listen(PORT, () => {
      console.log(`Server sedang berjalan di port ${PORT}`);
    });
  } catch (error) {
    console.error('Tidak bisa terhubung ke database:', error);
  }
}

startServer();