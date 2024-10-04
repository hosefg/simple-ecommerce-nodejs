const Sequelize = require('sequelize');
const sequelize = require('../db');

const Item = sequelize.define('item', {
    views: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    item_name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    item_description: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    item_price: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    item_type: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    item_stock: {
        type:Sequelize.INTEGER,
        allowNull: false,
    },
});

module.exports = Item;