const { Table } = require("../models");

// 🔍 GET ALL TABLES
exports.getAll = async (req, res) => {
  try {
    const tables = await Table.findAll({
      order: [["table_number", "ASC"]],
    });
    res.json(tables);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ➕ CREATE TABLE
exports.create = async (req, res) => {
  try {
    const { table_number } = req.body;

    // Validasi input
    if (!table_number) {
      return res.status(400).json({ error: "Nomor meja wajib diisi" });
    }

    // Cek duplikat nomor meja
    const existing = await Table.findOne({ where: { table_number } });
    if (existing) {
      return res.status(400).json({ error: "Nomor meja sudah ada" });
    }

    const table = await Table.create({
      table_number,
      status: "kosong",
    });

    res.json(table);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✏️ UPDATE TABLE
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { table_number, status } = req.body;

    const table = await Table.findByPk(id);

    if (!table) {
      return res.status(404).json({ error: "Meja tidak ditemukan" });
    }

    // Optional: validasi status
    const allowedStatus = ["kosong", "terisi"];
    if (status && !allowedStatus.includes(status)) {
      return res.status(400).json({ error: "Status tidak valid" });
    }

    await table.update({
      table_number: table_number || table.table_number,
      status: status || table.status,
    });

    res.json({ message: "Meja berhasil diupdate", data: table });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ❌ DELETE TABLE
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const table = await Table.findByPk(id);

    if (!table) {
      return res.status(404).json({ error: "Meja tidak ditemukan" });
    }

    await table.destroy();

    res.json({ message: "Meja berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};