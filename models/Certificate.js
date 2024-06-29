// models/Certificate.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./database'); // Adjust the path as necessary
const Member = require('./Member');


const Certificate = sequelize.define('Certificate', {
    certificateNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: 'Certificate number must be unique' },
        validate: {
            notNull: { msg: 'Certificate number cannot be null' },
            notEmpty: { msg: 'Certificate number cannot be empty' }
        }
    },
    memberId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Member,
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    issueDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW, // Use Sequelize.NOW to set default value to current timestamp
        get() {
            // Custom getter to format date as DD/MM/YYYY
            const date = this.getDataValue('issueDate');
            if (date) {
                const formattedDate = new Date(date).toLocaleDateString('en-GB');
                return formattedDate; // Return formatted date string
            }
            return null;
        }
    }
});

Certificate.belongsTo(Member, { foreignKey: 'memberId', as: 'member' });
Member.hasOne(Certificate, { foreignKey: 'memberId', as: 'certificateDetails' });

module.exports = Certificate;