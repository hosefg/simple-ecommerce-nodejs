const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../db');

const Account = sequelize.define('account', {
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: {
      msg: "The email address already exist!"
    },
    validate: {
      isEmail: {msg: "Email is invalid!"},
    },
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: {
        args:[6,100],
        msg: "Password must be at least 6 characters long"
      }
    },
  },
});

Account.prototype.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = Account;