const { Order, OrderItem, Table } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const orders = await Order.findAll({ include: [Table] });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { table_id, total_price, items } = req.body;
    const newOrder = await Order.create({ table_id, total_price, status: 'pending' });
    
    // Simpan detail item pesanan
    for (const item of items) {
      await OrderItem.create({
        order_id: newOrder.id,
        menu_id: item.menu_id,
        quantity: item.quantity,
        price: item.price
      });
    }

    // Ubah status meja jadi terisi
    await Table.update({ status: 'terisi' }, { where: { id: table_id } });

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fungsi tombol SELESAI
exports.finishOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: "Pesanan tidak ditemukan" });

    // 1. Update status pesanan menjadi completed
    await order.update({ status: 'completed' });

    // 2. KUNCI UTAMA: Update status meja terkait menjadi 'kosong'
    if (order.table_id) {
      await Table.update(
        { status: 'kosong' }, 
        { where: { id: order.table_id } }
      );
    }

    res.json({ message: "Pesanan selesai dan meja telah dikosongkan" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fungsi tombol HAPUS
exports.delete = async (req, res) => {
  try {
    const orderId = req.params.id;
    await Order.destroy({ where: { id: orderId } });
    res.json({ message: "Riwayat pesanan berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};