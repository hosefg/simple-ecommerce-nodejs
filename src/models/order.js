const Sequelize = require('sequelize');
const sequelize = require('../db');

const Order = sequelize.define('order', {
    order_number: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    order_status: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    total_price: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
});

module.exports = Order;