const { Order, OrderItem, Menu, Table } = require("../models");

exports.getAll = async (req, res) => {
  const orders = await Order.findAll({ include: OrderItem });
  res.json(orders);
};

exports.create = async (req, res) => {
  try {
    const { items, table_id } = req.body;

    if (!table_id) {
      return res.status(400).json({ error: "table_id wajib diisi" });
    }

    const table = await Table.findByPk(table_id);
    if (!table) {
      return res.status(404).json({ error: "Meja tidak ditemukan" });
    }

    let total = 0;

    const order = await Order.create({ table_id });

    for (let item of items) {
      const menu = await Menu.findByPk(item.menu_id);

      if (!menu) {
        return res.status(404).json({ error: "Menu tidak ditemukan" });
      }

      const price = menu.price * item.quantity;
      total += price;

      await OrderItem.create({
        order_id: order.id,
        menu_id: item.menu_id,
        quantity: item.quantity,
        price,
      });
    }

    order.total_price = total;
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};