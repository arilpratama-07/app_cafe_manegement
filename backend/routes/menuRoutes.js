const express = require('express');
const router = express.Router();
const { Menu } = require('../models'); // Pastikan path model benar

// Ambil semua menu
router.get("/", async (req, res) => {
  const data = await Menu.findAll();
  res.json(data);
});

// TAMBAH MENU (POST)
router.post("/", async (req, res) => {
  try {
    const newMenu = await Menu.create(req.body);
    res.status(201).json(newMenu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// EDIT MENU (PUT)
router.put("/:id", async (req, res) => {
  try {
    await Menu.update(req.body, { where: { id: req.params.id } });
    res.json({ message: "Menu berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// HAPUS MENU (DELETE)
router.delete("/:id", async (req, res) => {
  try {
    await Menu.destroy({ where: { id: req.params.id } });
    res.json({ message: "Menu berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;