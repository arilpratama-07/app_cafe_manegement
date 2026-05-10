const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('cafe_db', 'root', '', { host: 'localhost', dialect: 'mysql' });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import semua model
db.Menu = require('./Menu')(sequelize, DataTypes);
db.Table = require('./Table')(sequelize, DataTypes);
db.Order = require('./Order')(sequelize, DataTypes);
db.OrderItem = require('./OrderItem')(sequelize, DataTypes);

// HUBUNGAN (ASOSIASI) - WAJIB ADA agar data meja muncul di tabel pesanan
db.Order.belongsTo(db.Table, { foreignKey: 'table_id' });
db.Table.hasMany(db.Order, { foreignKey: 'table_id' });

module.exports = db;