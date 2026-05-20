const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// 1. Inisialisasi Koneksi Database (Sudah dijinakkan untuk Vercel & TiDB Cloud)
const sequelize = new Sequelize(
  process.env.DB_NAME || 'cafe_db',
  process.env.DB_USER || '26mH6PHTHxZ8bU2.root',
  process.env.DB_PASSWORD || 'EJCdztLQRXcLNxH6', // <-- Ganti DB_PASS menjadi DB_PASSWORD di sini
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    dialectModule: require('mysql2'), 
    logging: false,
    dialectOptions: process.env.DB_HOST ? {
      ssl: {
        rejectUnauthorized: true 
      }
    } : {} 
  }
);

// 2. Import & Inisialisasi Model
// 2. Import & Inisialisasi Model (Sesuaikan dengan nama file asli di folder!)
const User = require('./user')(sequelize, DataTypes); 
const Menu = require('./menu')(sequelize, DataTypes);
const Table = require('./table')(sequelize, DataTypes);
const Order = require('./order')(sequelize, DataTypes);
const OrderItem = require('./orderItem')(sequelize, DataTypes);

// 3. Definisi Relasi (Associations)
Order.belongsTo(Table, { foreignKey: 'table_id' });
Table.hasMany(Order, { foreignKey: 'table_id' });

Order.hasMany(OrderItem, { foreignKey: 'order_id' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

OrderItem.belongsTo(Menu, { foreignKey: 'menu_id' });

// 4. Export database object
const db = {
  sequelize,
  Sequelize, 
  User,      
  Menu,
  Table,
  Order,
  OrderItem
};

module.exports = db;