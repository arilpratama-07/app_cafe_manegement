require('dotenv').config(); // 1. Load env paling atas
const express = require('express'); // 2. Panggil express
const { Sequelize } = require('sequelize');

const app = express(); // 3. Inisialisasi app (Penting!)
const PORT = process.env.PORT || 5000;

// 4. Konfigurasi Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASSWORD, 
  {
    host: process.env.DB_HOST,
    dialect: 'mysql'
  }
);

// 5. Cek Koneksi Database & Jalankan Server
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Koneksi database berhasil!');
    
    // Sinkronisasi tabel (opsional, tapi berguna saat development)
    await sequelize.sync(); 

    app.listen(PORT, () => {
      console.log(`Server sedang berjalan di port ${PORT}`);
    });
  } catch (error) {
    console.error('Tidak bisa terhubung ke database:', error);
  }
}

startServer();