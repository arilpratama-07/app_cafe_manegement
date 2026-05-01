module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Menu", {
    name: DataTypes.STRING,
    price: DataTypes.FLOAT,
    category: DataTypes.STRING,
    stock: DataTypes.INTEGER,
  });
};