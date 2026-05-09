const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/', orderController.getAll);
router.post('/', orderController.create);
router.delete('/:id', orderController.delete);

// Rute penting untuk tombol "Selesai"
router.patch('/:id/finish', orderController.finishOrder);

module.exports = router;