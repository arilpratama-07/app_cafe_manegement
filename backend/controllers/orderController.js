const { Order, OrderItem, Table } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const orders = await Order.findAll({ 
      include: [Table] // Ini akan menarik nomor meja ke dalam data order
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { table_id, total_price, items } = req.body;
    
    // Simpan Order Utama
    const newOrder = await Order.create({ 
      table_id: parseInt(table_id), 
      total_price: parseFloat(total_price), 
      status: 'pending' 
    });
    
    // Simpan Detail Item (Looping)
    if (items && items.length > 0) {
      for (const item of items) {
        await OrderItem.create({
          order_id: newOrder.id,
          menu_id: item.menu_id,
          quantity: item.quantity,
          price: item.price
        });
      }
    }

    // Update Meja jadi Terisi
    await Table.update({ status: 'terisi' }, { where: { id: table_id } });

    res.status(201).json(newOrder);
  } catch (error) {
    console.error("❌ ERROR CREATE ORDER:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.finishOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: "Pesanan tidak ditemukan" });

    // Selesaikan Pesanan
    await order.update({ status: 'completed' });

    // Kosongkan Meja
    if (order.table_id) {
      await Table.update({ status: 'kosong' }, { where: { id: order.table_id } });
    }

    res.json({ message: "Pesanan selesai dan meja kosong" });
  } catch (error) {
    console.error("❌ ERROR FINISH ORDER:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await Order.destroy({ where: { id: req.params.id } });
    res.json({ message: "Hapus riwayat berhasil" });
  } catch (error) {
    console.error("❌ ERROR DELETE ORDER:", error);
    res.status(500).json({ message: error.message });
  }
};