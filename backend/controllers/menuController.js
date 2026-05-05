const { Menu } = require("../models");


exports.getAll = async (req, res) => {
  res.json(await Menu.findAll());
};

exports.create = async (req, res) => {
  try {
    res.json(await Menu.create(req.body));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  await Menu.update(req.body, { where: { id: req.params.id } });
  res.json({ message: "Updated" });
};

exports.delete = async (req, res) => {
  await Menu.destroy({ where: { id: req.params.id } });
  res.json({ message: "Deleted" });
};

exports.create = async (req, res) => {
  const data = await Menu.create({
    ...req.body,
    price: req.body.price || 0
  });
  res.json(data);
};