const express = require('express');
const connection = require('../connection');
const router = express.Router();


router.post('/signup', (req, res) => {
    let user = req.body;

    let query = "SELECT email, password, role, status FROM user WHERE email=?";

    // nanti lanjut query ke database
});

module.exports = router;