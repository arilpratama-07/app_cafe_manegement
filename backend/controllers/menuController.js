const { Menu } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const menus = await Menu.findAll();
    res.json(menus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, category, price } = req.body;
    
    // Validasi: pastikan data tidak kosong
    if (!name || !price) {
      return res.status(400).json({ message: "Nama dan harga wajib diisi!" });
    }

    let imagePath = null;
    if (req.file) {
      imagePath = '/uploads/' + req.file.filename;
    }

    // Eksekusi Simpan ke Database
    const newMenu = await Menu.create({
      name: name,
      category: category || 'Umum',
      price: parseFloat(price), // Pastikan harga adalah angka
      image: imagePath
    });

    console.log("✅ Berhasil simpan menu:", newMenu.name);
    res.status(201).json(newMenu);
  } catch (error) {
    // 🔍 LIHAT TERMINAL VS CODE ANDA SAAT ERROR TERJADI
    console.error("❌ ERROR DETECTED:", error); 
    res.status(500).json({ 
      message: "Gagal simpan ke database", 
      detail: error.message 
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price } = req.body;
    
    const menu = await Menu.findByPk(id);
    if (!menu) return res.status(404).json({ message: 'Menu tidak ditemukan' });

    // Pakai gambar lama sebagai default
    let imagePath = menu.image; 
    
    // Jika user mengupload foto BARU, ganti fotonya
    if (req.file) {
      imagePath = '/uploads/' + req.file.filename;
    }

    await menu.update({
      name,
      category,
      price,
      image: imagePath
    });

    res.json(menu);
  } catch (error) {
    console.error("Error Update Menu:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await Menu.destroy({ where: { id } });
    res.json({ message: 'Menu berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};