const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./database'); // Adjust the path as necessary

const Member = sequelize.define('Member', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: 'Name cannot be null' },
            notEmpty: { msg: 'Name cannot be empty' }
        }
    },
    surname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: 'Surname cannot be null' },
            notEmpty: { msg: 'Surname cannot be empty' }
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: 'Email is already taken' },
        validate: {
            notNull: { msg: 'Email cannot be null' },
            notEmpty: { msg: 'Email cannot be empty' },
            isEmail: { msg: 'Email must be a valid email address' }
        }
    },
    department: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: 'Department cannot be null' },
            notEmpty: { msg: 'Department cannot be empty' }
        }
    },
    status: {
        type: DataTypes.ENUM('PENDING', 'APPROVED'),
        allowNull: false,
        defaultValue: 'PENDING',
        validate: {
            notNull: { msg: 'Status cannot be null' },
            isIn: {
                args: [['PENDING', 'APPROVED']],
                msg: 'Status must be one of PENDING, APPROVED'
            }
        }
    },
    modifiedBy: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    hooks: {
        beforeCreate: (member, options) => {
            if (options && options.modifiedBy) {
                member.modifiedBy = options.modifiedBy;
            }
        }
    }
});

module.exports = Member;


