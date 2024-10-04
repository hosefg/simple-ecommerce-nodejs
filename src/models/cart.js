const Sequelize = require('sequelize');
const sequelize = require('../db');

const Cart = sequelize.define('cart', {
    cart_status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    total_ammount: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
});

module.exports = Cart;