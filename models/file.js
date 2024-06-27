const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const File = sequelize.define('File', {
    path: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  
  module.exports = File;