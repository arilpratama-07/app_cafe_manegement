require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); 
const cron = require('node-cron'); // <-- 1. Tambahan: Import Cron Job

// 2. Tambahan: Panggil 'Table' bersama 'sequelize' dari folder models
const { sequelize, Table } = require('./models'); 

const app = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Membuka folder 'uploads' agar gambar bisa diakses oleh frontend
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- ROUTES ---
app.use("/menu", require("./routes/menuRoutes"));
app.use("/tables", require("./routes/tableRoutes"));
app.use("/orders", require("./routes/orderRoutes")); 


// 3. TAMBAHAN: JADWAL RESET MEJA OTOMATIS (CRON JOB)
// Berjalan setiap hari pada jam 00:00 (Tengah Malam) Waktu Indonesia Barat
// Menjadwalkan tugas otomatis (Cron Job) menggunakan library node-cron
cron.schedule('0 0 * * *', async () => {
  try {
    if (Table) {
      await Table.update(
        { status: 'kosong' }, 
        { where: {} } 
      );

      console.log('✅ Sistem: Semua meja telah otomatis di-reset menjadi KOSONG (Jadwal Harian).');
      
    } else {
      console.log('⚠️ Model Table gagal dimuat oleh Cron Job.');
    }
  } catch (error) {
    // Jika terjadi error (misal: database mati), catat pesan errornya agar bisa diperbaiki
    console.error('❌ Gagal mereset meja:', error);
  }
}, {
  // --- INI ADALAH TAMBAHAN UNTUK MEMASTIKAN ZONA WAKTU BENAR ---
  scheduled: true,
  timezone: "Asia/Jakarta" 
});



// --- DATABASE & SERVER ---
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Koneksi database berhasil!');
    
    // Kembalikan ke sync() biasa agar tidak terjadi error 1067
    await sequelize.sync(); 

    app.listen(PORT, () => {
      console.log(`Server sedang berjalan di port ${PORT}`);
    });
  } catch (error) {
    console.error('Tidak bisa terhubung ke database:', error);
  }
}

startServer();