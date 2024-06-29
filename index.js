const express = require('express');
const sequelize = require('./models/database'); // Your Sequelize setup
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const User = require('./models/User'); // Importing the User model
const bcrypt = require('bcrypt');
const authRouter= require('./routes/authentication'); // Authentication routes
const fileRoutes = require('./routes/fileRoutes');
const memberRoutes = require('./routes/member');
const certificateRoutes = require('./routes/certificate');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
const setupSwagger = require('./config/swagger');
setupSwagger(app);

// Synchronize the database
sequelize.sync().then(() => {
    console.log('Database synchronized');
    createAdminUser();
});
// Function to create admin user if not exists
const createAdminUser = async () => {
    try {
        const adminUser = await User.findOne({ where: { username: 'admin' } });
        if (!adminUser) {
            const hashedPassword = await bcrypt.hash('admin1234', 10);
            await User.create({
                username: 'admin',
                first_name: 'admin',
                last_name: 'admin',
                role: 'SUPER_ADMIN',
                email: 'admin@example.com', // You can add a default email or make it nullable
                status: 'ACTIVE',
                password: hashedPassword,
            });
            console.log('Admin user created');
        } else {
            console.log('Admin user already exists');
        }
    } catch (err) {
        console.error('Error creating admin user:', err.message);
    }
};
// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/files', fileRoutes);
app.use('/api/v1/members', memberRoutes);
app.use('/api/v1/certificates', certificateRoutes);
// Error handler middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
