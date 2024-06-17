const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./database');

const User = sequelize.define('User', {
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
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            msg: 'Firstname is already taken' // Custom message for uniqueness constraint
        },
        validate: {
            notNull: {
                msg: 'First name cannot be null'
            },
            notEmpty: {
                msg: 'First name cannot be empty'
            }
            // You can add more validations as needed
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            msg: 'Email is already taken' // Custom message for uniqueness constraint
        },
        validate: {
            notNull: {
                msg: 'Email cannot be null'
            },
            notEmpty: {
                msg: 'Email cannot be empty'
            }
            // You can add more validations as needed
        }
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Last name cannot be null'
            },
            notEmpty: {
                msg: 'Last name cannot be empty'
            }
            // You can add more validations as needed
        }
    },
    status: {
        type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED'),
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Status cannot be null'
            },
            isIn: {
                args: [['ACTIVE', 'INACTIVE', 'SUSPENDED']],
                msg: 'Status must be one of ACTIVE, INACTIVE, SUSPENDED'
            }
        }
    },
    role: {
        type: DataTypes.ENUM('ADMIN', 'USER', 'SUPER_ADMIN'),
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Status cannot be null'
            },
            isIn: {
                args: [['ADMIN', 'USER', 'SUPER_ADMIN']],
                msg: 'Status must be one of ADMIN, USER, SUPER_ADMIN'
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Password cannot be null'
            },
            notEmpty: {
                msg: 'Password cannot be empty'
            }
            // You can add more validations as needed
        }
    },
  
});

module.exports = User;
