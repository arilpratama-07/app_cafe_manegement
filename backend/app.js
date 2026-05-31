require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); 
const cron = require('node-cron');

// 1. IMPORT MODELS SEBAGAI 'db'
const db = require('./models'); 

const app = express();
const PORT = process.env.PORT || 5000;


// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- 🌟 RUTE UTAMA (Mencegah Cannot GET /) ---
app.get('/', (req, res) => {
  res.status(200).json({
    message: "Welcome to Cafe Management System API!",
    status: "Server is running smoothly",
    environment: process.env.NODE_ENV || "development"
  });
});

// --- ROUTES ---
app.use("/menu", require("./routes/menuRoutes"));
app.use("/tables", require("./routes/tableRoutes"));
app.use("/orders", require("./routes/orderRoutes")); 

// --- 2. JADWAL RESET MEJA (CRON JOB) ---
cron.schedule('0 0 * * *', async () => {
  try {
    // Memanggil Table lewat objek db
    await db.Table.update(
      { status: 'kosong' }, 
      { where: {} } 
    );
    console.log('✅ Sistem: Semua meja telah otomatis di-reset menjadi KOSONG.');
  } catch (error) {
    console.error('❌ Gagal mereset meja:', error);
  }
}, {
  scheduled: true,
  timezone: "Asia/Jakarta" 
});

// --- 3. RUTE LOGIN ---
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    // Mencari user di tabel User
    const user = await db.User.findOne({ where: { username, password } });
    
    if (!user) {
      return res.status(401).json({ message: 'Username atau Password salah!' });
    }
    
    res.json({ 
      id: user.id, 
      username: user.username, 
      role: user.role 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- 4. FUNGSI START SERVER & INITIAL DATA ---
async function startServer() {
  try {
    // Autentikasi koneksi
    await db.sequelize.authenticate();
    console.log('Koneksi database berhasil!');
    
    // Sinkronisasi Tabel
    await db.sequelize.sync(); 

    // --- OTOMATIS BIKIN AKUN (SEEDER) ---
    // Cek/Buat Admin
    await db.User.findOrCreate({
      where: { username: 'admin' },
      defaults: { password: '123', role: 'admin' }
    });

    // Cek/Buat Kasir
    await db.User.findOrCreate({
      where: { username: 'kasir' },
      defaults: { password: '123', role: 'user' }
    });

    console.log('✅ Cek data user selesai.');

    app.listen(PORT, () => {
      console.log(`Server sedang berjalan di port ${PORT}`);
    });
  } catch (error) {
    console.error('Tidak bisa terhubung ke database:', error);
  }
}

startServer();
module.exports = app;