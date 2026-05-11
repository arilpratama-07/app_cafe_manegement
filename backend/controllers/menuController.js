const { Menu } = require('../models'); // Import model Menu

// 1. TAMPILKAN SEMUA MENU
exports.getAll = async (req, res) => {
  try {
    const menus = await Menu.findAll(); // Ambil semua data dari database
    res.json(menus); // Kirim hasilnya ke user
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. TAMBAH MENU BARU
exports.create = async (req, res) => {
  try {
    const { name, category, price } = req.body; // Ambil inputan teks
    
    // Tolak jika nama atau harga kosong
    if (!name || !price) {
      return res.status(400).json({ message: "Nama dan harga wajib diisi!" });
    }

    let imagePath = null;
    // Jika ada file gambar yang diupload, simpan lokasinya
    if (req.file) {
      imagePath = '/uploads/' + req.file.filename;
    }

    // Masukkan data ke database
    const newMenu = await Menu.create({
      name: name,
      category: category || 'Umum', // Default 'Umum' kalau tidak diisi
      price: parseFloat(price),     // Pastikan harga jadi format angka
      image: imagePath
    });

    console.log("✅ Berhasil simpan menu:", newMenu.name);
    res.status(201).json(newMenu); // Kirim respon sukses
  } catch (error) {
    console.error("❌ ERROR DETECTED:", error); 
    res.status(500).json({ 
      message: "Gagal simpan ke database", 
      detail: error.message 
    });
  }
};

// 3. EDIT MENU 
// Tambahkan kata 'async' sebelum (req, res)
exports.update = async (req, res) => { 
  try {
    const { id } = req.params;
    const { name, category, price } = req.body;
    
    // Cari menu berdasarkan ID
    const menu = await Menu.findByPk(id);

    if (!menu) return res.status(404).json({ message: "Menu tidak ditemukan" });

    // Logika gambar: jika ada file baru pakai yang baru, jika tidak pakai yang lama
    const imagePath = req.file ? `/uploads/${req.file.filename}` : menu.image;

    // Proses update data ke database
    await menu.update({
      name,
      category,
      price: parseFloat(price),
      image: imagePath
    });

    res.json({ message: "Menu berhasil diperbarui!", menu });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. HAPUS MENU 
exports.delete = async (req, res) => {
  try {
    const { id } = req.params; // Ambil ID dari URL
    await Menu.destroy({ where: { id } }); // Hapus data dari database
    res.json({ message: 'Menu berhasil dihapus' }); // Kirim respon sukses
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};