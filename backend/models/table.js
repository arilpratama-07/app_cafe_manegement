module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Table", {
    table_number: DataTypes.INTEGER,
    status: {
      type: DataTypes.STRING,
      defaultValue: "kosong",
    },
  });
};