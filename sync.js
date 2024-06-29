// sync.js
const sequelize = require('./models/database');
const Member = require('./models/Member');
const Certificate = require('./models/Certificate');


// Set up associations
// Member.hasOne(Certificate, { foreignKey: 'memberId', as: 'certificateDetails' });
// Certificate.belongsTo(Member, { foreignKey: 'memberId', as: 'member' });

sequelize.sync({ force: true }).then(() => {
    console.log('Database & tables created!');
}).catch(error => {
    console.error('Error creating database & tables:', error);
});