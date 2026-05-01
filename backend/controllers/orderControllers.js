const { Order, OrderItem, Menu } = require("../models");

exports.getAll = async (req, res) => {
  res.json(await Order.findAll({ include: OrderItem }));
};

exports.create = async (req, res) => {
  try {
    const { items, table_id } = req.body;
    let total = 0;

    const order = await Order.create({ table_id });

    for (let item of items) {
      const menu = await Menu.findByPk(item.menu_id);
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
    res.status(400).json({ error: err.message });
  }
};