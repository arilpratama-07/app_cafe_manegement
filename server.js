require('dotenv').config(); // AMBIL SETTING: Mengaktifkan variabel dari file .env

const http = require('http'); 
const express = require('express');

const app = express();
app.use(express.json());

const userRoute = require('./routes/user');
app.use('/', userRoute);

// 1. PEMBUATAN SERVER: Menyiapkan infrastruktur server HTTP
const server = http.createServer(app);

// 2. AKTIVASI: Menjalankan server agar mulai mendengarkan request
server.listen(process.env.PORT, () => {
    // Memberi tahu di terminal bahwa server sudah aktif
    console.log("Server jalan di port " + process.env.PORT);
});