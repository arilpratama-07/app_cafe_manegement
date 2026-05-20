// Export model Menu
module.exports = (sequelize, DataTypes) => {
    // Membuat tabel "Menu"
  return sequelize.define("Menu", {
    name: {
      type: DataTypes.STRING,
      allowNull: false // wajib diisi dan tidak boleh kosong
    },
        // Nama menu
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    // Kategori 
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
        // Foto menu
    image: {
      type: DataTypes.STRING,
      allowNull: true // boleh kosong
    }
  }, {
    // Nama tabel 
    tableName: 'menus'
  });
};