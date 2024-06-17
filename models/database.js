const { Sequelize } = require('sequelize');

// Create a new Sequelize instance
const sequelize = new Sequelize('userDb', 'root', 'admin', {
    host: 'localhost',
    dialect: 'mysql',
});

module.exports = sequelize;
