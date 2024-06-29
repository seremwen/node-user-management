// sync.js
const sequelize = require('./models/database');


sequelize.sync({ force: true }).then(() => {
    console.log('Database & tables created!');
}).catch(error => {
    console.error('Error creating database & tables:', error);
});