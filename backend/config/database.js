require("dotenv").config(); // Baca data rahasia dari file .env

const { Sequelize } = require("sequelize"); // Import library Sequelize

console.log(process.env.DB_NAME); // Cek nama database di terminal

// Bikin koneksi ke database MySQL pakai data dari .env
const sequelize = new Sequelize(
  process.env.DB_NAME, // Nama database
  process.env.DB_USER, // Username
  process.env.DB_PASS, // Password
  {
    host: process.env.DB_HOST, // Alamat server
    port: process.env.DB_PORT, // Port 
    dialect: "mysql",          // Jenis database
  }
);

module.exports = sequelize; // Export koneksi agar bisa dipakai di file lain