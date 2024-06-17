const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./database');

const ResetToken = sequelize.define('ResetToken', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            msg: 'Username is already taken' // Custom message for uniqueness constraint
        },
        validate: {
            notNull: {
                msg: 'Username cannot be null'
            },
            notEmpty: {
                msg: 'Username cannot be empty'
            }
            // You can add more validations as needed
        }
    },
    resetPasswordToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    resetPasswordExpires: {
        type: DataTypes.DATE,
        allowNull: true
    }
});

module.exports = ResetToken;