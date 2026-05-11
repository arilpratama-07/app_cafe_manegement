const { Table } = require("../models"); // Import model Table

//1. TAMPILKAN SEMUA MEJA
exports.getAll = async (req, res) => {
  try {
    const tables = await Table.findAll({
      order: [["table_number", "ASC"]], // Urutkan nomor meja dari yang terkecil ke terbesar
    });
    res.json(tables); // Kirim datanya ke user
  } catch (err) {
    console.error("Error di getAll Tables:", err); // Munculkan pesan error di terminal
    res.status(500).json({ error: err.message });
  }
};

//2. TAMBAH MEJA BARU
exports.create = async (req, res) => {
  try {
    const { table_number } = req.body; // Ambil inputan nomor meja

    // Tolak jika nomor meja kosong
    if (!table_number) {
      return res.status(400).json({ error: "Nomor meja wajib diisi" });
    }

    // Cek apakah nomor meja tersebut sudah pernah dibuat sebelumnya
    const existing = await Table.findOne({ where: { table_number } });
    if (existing) {
      return res.status(400).json({ error: "Nomor meja sudah ada" });
    }

    // Masukkan meja baru ke database dengan status awal 'kosong'
    const table = await Table.create({
      table_number,
      status: "kosong", 
    });

    res.json(table); // Kirim respon sukses
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//3. EDIT DATA MEJA
exports.update = async (req, res) => {
  try {
    const { id } = req.params; // Ambil ID meja dari URL
    const { table_number, status } = req.body; // Ambil inputan data yang baru

    const table = await Table.findByPk(id); // Cari mejanya di database

    // Tolak jika meja tidak ditemukan
    if (!table) {
      return res.status(404).json({ error: "Meja tidak ditemukan" });
    }

    // Pastikan input status hanya boleh berisi 'kosong' atau 'terisi'
    const allowedStatus = ["kosong", "terisi"];
    if (status && !allowedStatus.includes(status)) {
      return res.status(400).json({ error: "Status tidak valid" });
    }

    // Simpan perubahan. (Jika input kosong, tetap gunakan data yang lama)
    await table.update({
      table_number: table_number || table.table_number,
      status: status || table.status,
    });

    res.json({ message: "Meja berhasil diupdate", data: table }); // Kirim respon sukses
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. HAPUS MEJA
exports.delete = async (req, res) => {
  try {
    const { id } = req.params; // Ambil ID meja dari URL

    const table = await Table.findByPk(id); // Cari mejanya di database

    // Tolak jika meja tidak ditemukan
    if (!table) {
      return res.status(404).json({ error: "Meja tidak ditemukan" });
    }

    await table.destroy(); // Hapus meja dari database

    res.json({ message: "Meja berhasil dihapus" }); // Kirim respon sukses
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};