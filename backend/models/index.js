const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// 1. Inisialisasi Koneksi Database
const sequelize = new Sequelize(
  process.env.DB_NAME || 'cafe_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false
  }
);

// 2. Import & Inisialisasi Model
// Pastikan baris-baris ini ada SEBELUM bagian relasi/associations
const Menu = require('./Menu')(sequelize, DataTypes);
const Table = require('./Table')(sequelize, DataTypes);
const Order = require('./Order')(sequelize, DataTypes);
const OrderItem = require('./OrderItem')(sequelize, DataTypes);

// 3. Definisi Relasi (Associations)
// Sekarang variabel Order, Table, dll sudah dikenali oleh sistem

// Relasi Order ke Table
Order.belongsTo(Table, { foreignKey: 'table_id' });
Table.hasMany(Order, { foreignKey: 'table_id' });

// Relasi Order ke OrderItem (Detail)
Order.hasMany(OrderItem, { foreignKey: 'order_id' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

// Relasi OrderItem ke Menu (Untuk tahu nama makanan)
OrderItem.belongsTo(Menu, { foreignKey: 'menu_id' });

// 4. Export database object
const db = {
  sequelize,
  Sequelize,
  Menu,
  Table,
  Order,
  OrderItem
};

module.exports = db;