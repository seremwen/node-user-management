const { Sequelize } = require('sequelize');

// Create a new Sequelize instance
const sequelize = new Sequelize('userDb', 'root_nc', 'rp2MBhxmM@', {
    host: '54.209.220.167',
    
    dialect: 'mysql',
});

module.exports = sequelize;
