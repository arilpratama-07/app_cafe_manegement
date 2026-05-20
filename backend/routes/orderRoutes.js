const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Rute untuk mengambil semua pesanan (Ini yang bikin 404 kalau tidak ada)
router.get('/', orderController.getAll);

router.post('/', orderController.create);
router.delete('/:id', orderController.delete);
router.patch('/:id/finish', orderController.finishOrder);


// Export router agar bisa dipakai di app.js
module.exports = router; 
