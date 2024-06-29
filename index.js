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

// Swagger setup
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'File handling API',
            version: '1.0.0',
            description: 'API endpoints for file handling',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./routes/*.js'], // Files containing Swagger annotations (adjust as per your file structure)
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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
app.use('/auth', authRouter);
app.use('/api', fileRoutes);
app.use('/members', memberRoutes);
app.use('/certificates', certificateRoutes);
// Error handler middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
