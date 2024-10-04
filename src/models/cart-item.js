const Sequelize = require('sequelize');
const sequelize = require('../db');

const CartItem = sequelize.define('cart-item', {
    item_ammount: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    item_price: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    total_price: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
});

module.exports = CartItem;