const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const Menu = require("./menu")(sequelize, Sequelize);
const Order = require("./order")(sequelize, Sequelize);
const OrderItem = require("./orderItem")(sequelize, Sequelize);
const Table = require("./table")(sequelize, Sequelize);

Order.hasMany(OrderItem, { foreignKey: "order_id" });
OrderItem.belongsTo(Order);

OrderItem.belongsTo(Menu, { foreignKey: "menu_id" });

Order.belongsTo(Table, { foreignKey: "table_id" });

module.exports = { sequelize, Menu, Order, OrderItem, Table };