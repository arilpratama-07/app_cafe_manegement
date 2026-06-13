const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Konfigurasi Cloudinary pakai ENV variable
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Konfigurasi penyimpanan ke Cloudinary (bukan lokal)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'cafe_menu', // Folder di Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    transformation: [{ width: 600, height: 600, crop: 'limit', quality: 'auto' }]
  }
});

const upload = multer({ storage: storage });

// Rute API
router.get('/', menuController.getAll);
router.post('/', upload.single('image'), menuController.create);
router.put('/:id', upload.single('image'), menuController.update);
router.delete('/:id', menuController.delete);

module.exports = router;