const mysql = require('mysql'); // Memanggil driver MySQL untuk Node.js
require('dotenv').config(); // Memanggil library untuk membaca file .env (keamanan data)

// 1. PENGATURAN KREDENSIAL DATABASE
var connection = mysql.createConnection({
    port: process.env.DB_PORT,      // Nomor port database 
    host: process.env.DB_HOST,      // Alamat server database 
    user: process.env.DB_USERNAME,  // Nama pengguna database 
    password: process.env.DB_PASSWORD, // Kata sandi database
    database: process.env.DB_NAME   // Nama database yang digunakan
});

// 2. PROSES PENYAMBUNGAN
connection.connect((err) => {
    if (!err) {
        console.log("Berhasil koneksi"); // Pesan jika berhasil terhubung
    } else {
        console.log(err); // Pesan jika gagal (biasanya karena salah user/password/host)
    }
});

// 3. EKSPOR KONEKSI
module.exports = connection; // Supaya bisa dipakai di file lain (seperti file signup tadi)