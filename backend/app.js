require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); 
const { sequelize } = require('./models'); 

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