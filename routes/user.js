const express = require('express');
const connection = require('../connection');
const router = express.Router();

// Endpoint POST untuk pendaftaran
router.post('/signup', (req, res) => {
    let user = req.body; // Ambil input dari user

    // 1. QUERY CEK EMAIL (Cegah Duplikasi)
    let query = "SELECT email FROM user WHERE email=?";
    
    connection.query(query, [user.email], (err, results) => {

        if (err) return res.status(500).json(err); // Error Database

        // 2. LOGIKA: Jika email TIDAK ditemukan (kosong)
        if (results.length <= 0) {

            // 3. QUERY INSERT (Simpan User Baru)
            // Default: status 'false' (non-aktif), role 'user'
            query = "INSERT INTO user(nama, contactNumber, email, password, status, role) VALUES(?,?,?,?, 'false','user')";
            
            connection.query(query, [user.nama, user.contactNumber, user.email, user.password], (err, results) => {
                if (err) return res.status(500).json(err);
                
                return res.status(200).json({ message: "Successfully Registered" }); // Berhasil
            });

        } else {
            // 4. LOGIKA: Jika email SUDAH ADA
            return res.status(400).json({ message: "Email Already Exists" });
        }

    });
});

module.exports = router;