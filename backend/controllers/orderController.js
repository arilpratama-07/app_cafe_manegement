const { Order, OrderItem, Table } = require('../models'); // Import model yang dibutuhkan

exports.getAll = async (req, res) => {
  try {
    // Mengambil data pesanan beserta data meja dan item detailnya
    const orders = await Order.findAll({ 
      include: [
        { model: Table },
        { model: OrderItem }
      ] 
    });
    res.json(orders);
  } catch (error) {
    // Jika masih error, pesan ini akan muncul di Terminal VS Code Anda
    console.error("EROR DI BACKEND:", error); 
    res.status(500).json({ message: "Gagal memproses data di server" });
  }
};
//2. BUAT PESANAN BARU
exports.create = async (req, res) => {
  try {
    const { table_id, total_price, items } = req.body; // Ambil data dari inputan
    
    // 2a. Simpan Data Pesanan Utama
    const newOrder = await Order.create({ 
      table_id: parseInt(table_id), 
      total_price: parseFloat(total_price), 
      status: 'pending' // Status awal pesanan
    });
    
    // 2b. Simpan Detail Item yang Dipesan
    if (items && items.length > 0) {
      for (const item of items) { // Looping untuk menyimpan setiap menu yang dipesan
        await OrderItem.create({
          order_id: newOrder.id, // Sambungkan ke ID pesanan yang baru dibuat di atas
          menu_id: item.menu_id,
          quantity: item.quantity,
          price: item.price
        });
      }
    }

    // 2c. Update Status Meja
    await Table.update({ status: 'terisi' }, { where: { id: table_id } }); // Meja otomatis jadi 'terisi'

    res.status(201).json(newOrder); // Kirim respon sukses
  } catch (error) {
    console.error("❌ ERROR CREATE ORDER:", error);
    res.status(500).json({ message: error.message });
  }
};

//3. SELESAIKAN PESANAN (BAYAR/SELESAI)
exports.finishOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id); // Cari pesanan berdasarkan ID
    if (!order) return res.status(404).json({ message: "Pesanan tidak ditemukan" });

    // 3a. Ubah status pesanan jadi selesai
    await order.update({ status: 'completed' });

    // 3b. MATIKAN PENGOSONGAN MEJA (Tambahkan // di awal baris)
    if (order.table_id) {
      await Table.update({ status: 'kosong' }, { where: { id: order.table_id } });
    }

    // 3c. Ubah juga pesan suksesnya agar lebih sesuai
    res.json({ message: "Pesanan selesai, meja tetap terisi" }); 
  } catch (error) {
    console.error("❌ ERROR FINISH ORDER:", error);
    res.status(500).json({ message: error.message });
  }
};

// 4. HAPUS PESANAN
exports.delete = async (req, res) => {
  try {
    await Order.destroy({ where: { id: req.params.id } }); // Hapus data pesanan dari database
    res.json({ message: "Hapus riwayat berhasil" }); // Kirim respon sukses
  } catch (error) {
    console.error("❌ ERROR DELETE ORDER:", error);
    res.status(500).json({ message: error.message });
  }
};