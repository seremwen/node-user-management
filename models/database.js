const { Sequelize } = require('sequelize');

// Create a new Sequelize instance
const sequelize = new Sequelize('userDb', 'root_nc', 'rp2MBhxmM@', {
    host: '44.203.89.224',
    
    dialect: 'mysql',
});

module.exports = sequelize;
