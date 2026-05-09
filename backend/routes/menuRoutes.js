const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const multer = require('multer');
const path = require('path');

// Konfigurasi tempat simpan foto
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/'); // Foto akan masuk ke folder uploads
  },
  filename: function (req, file, cb) {
    // Menamai foto dengan angka unik agar tidak bentrok
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Rute API
router.get('/', menuController.getAll);
router.post('/', upload.single('image'), menuController.create);
router.put('/:id', upload.single('image'), menuController.update);
router.delete('/:id', menuController.delete);

module.exports = router;