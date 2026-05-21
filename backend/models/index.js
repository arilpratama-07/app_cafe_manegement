// ==================== 1. INISIALISASI UTAMA ====================
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const isLocal = !process.env.DB_HOST || process.env.DB_HOST === 'localhost' || process.env.DB_HOST === '127.0.0.1';

const sequelize = new Sequelize(
  process.env.DB_NAME || 'cafe_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    dialectModule: require('mysql2'), 
    logging: false,
    dialectOptions: isLocal ? {
      ssl: false 
    } : {
      ssl: {
        rejectUnauthorized: true 
      }
    }
  }
); // <── Hanya boleh ada satu penutup di sini!

// ==================== 2. IMPORT & INISIALISASI MODEL ====================
const User = require('./user')(sequelize, DataTypes); 
const Menu = require('./menu')(sequelize, DataTypes);
const Table = require('./table')(sequelize, DataTypes);
const Order = require('./order')(sequelize, DataTypes);
const OrderItem = require('./orderItem')(sequelize, DataTypes);

// ==================== 3. DEFINISI RELASI (ASSOCIATIONS) ====================
Order.belongsTo(Table, { foreignKey: 'table_id' });
Table.hasMany(Order, { foreignKey: 'table_id' });

Order.hasMany(OrderItem, { foreignKey: 'order_id' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

OrderItem.belongsTo(Menu, { foreignKey: 'menu_id' });

// ==================== 4. EXPORT DATABASE OBJECT ====================
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