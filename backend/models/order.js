module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define("Order", {
    total_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending"
    },
    table_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  return Order;
};