module.exports = (sequelize, DataTypes) => {
  const Table = sequelize.define("Table", {
    // Sesuaikan dengan controller: namanya table_number
    table_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    // Sesuaikan dengan controller: status "kosong" dan "terisi"
    status: {
      type: DataTypes.ENUM("kosong", "terisi"),
      defaultValue: "kosong",
    }
  }, {
    tableName: "tables",
    timestamps: true, 
  });

  return Table; 
};