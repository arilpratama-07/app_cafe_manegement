module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    total_price: DataTypes.DECIMAL(10, 2),
    status: DataTypes.STRING,
    table_id: DataTypes.INTEGER
  });
  return Order;
};