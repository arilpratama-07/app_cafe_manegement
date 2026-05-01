module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Order", {
    total_price: DataTypes.FLOAT,
    status: {
      type: DataTypes.STRING,
      defaultValue: "pending",
    },
  });
};