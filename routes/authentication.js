const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken'); // Your authenticateToken middleware
const User = require('../models/User'); // Your User model
const JWT_SECRET = 'your-key'; // Replace with your actual JWT secret

// Function to send email
const sendEmail = async (recipientEmail, subject, text) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com', // SMTP server
        port: 587, // SMTP server port
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'devseremwe@gmail.com', 
            pass: 'your-email-password', 
        },
        tls: {
            rejectUnauthorized: false // Accept self-signed certificates
        }
    });

    await transporter.sendMail({
        from: '"Dev Seremwe" devseremwe@gmail.com', 
        to: recipientEmail,
        subject: subject,
        text: text,
    });
};

// User registration
/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API endpoints for Authentication
 */
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - last_name
 *               - first_name
 *               - email
 *               - status
 *               - role
 *             properties:
 *               username:
 *                 type: string
 *               last_name:
 *                 type: string
 *               first_name:
 *                 type: string
 *               email:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum:
 *                   - ACTIVE
 *                   - INACTIVE
 *                   - SUSPENDED
 *               role:
 *                 type: string
 *                 enum:
 *                   - ADMIN
 *                   - USER
 *                   - SUPER_ADMIN
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/register', authenticateToken, async (req, res) => {
    try {
        const { username, first_name, last_name, email, status, role } = req.body;

        // Check if status is one of the allowed values
        if (!['ACTIVE', 'INACTIVE', 'SUSPENDED'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }
        
        // Check if role is one of the allowed values
        if (!['ADMIN', 'USER', 'SUPER_ADMIN'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role value' });
        }

        const password = generateRandomPassword(); // Generate a random password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ username, password: hashedPassword, role, first_name, last_name, email, status });

        // Send the password to the user's email
        await sendEmail(
            email,
            'Your account has been created',
            `Dear ${first_name},\n\nYour account has been created successfully. Your password is: ${password}\n\nPlease change your password after logging in for the first time.\n\nBest regards,\nYour Team`
        );

        res.status(201).json({ message: 'User created and password sent to email', user });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// User signup
/**
 * @swagger
 * /auth/sign-up:
 *   post:
 *     summary: Signup
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - last_name
 *               - first_name
 *               - email
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               last_name:
 *                 type: string
 *               first_name:
 *                 type: string
 *               email:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum:
 *                   - ACTIVE
 *                   - INACTIVE
 *                   - SUSPENDED
 *               role:
 *                 type: string
 *                 enum:
 *                   - ADMIN
 *                   - USER
 *                   - SUPER_ADMIN
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/sign-up', async (req, res) => {
    try {
        const { username, password, first_name, last_name, email, status, role } = req.body;

        // Check if status is one of the allowed values
        if (!['ACTIVE', 'INACTIVE', 'SUSPENDED'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }
        
        // Check if role is one of the allowed values
        if (!['ADMIN', 'USER', 'SUPER_ADMIN'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role value' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashedPassword, role, first_name, last_name, email, status });

        res.status(201).json({ message: 'User created', user });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// User login
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const payload = {
            id: user.id,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            status: user.status,
            role: user.role
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
            const errors = err.errors.map(error => error.message);
            return res.status(400).json({ message: 'Validation error', errors });
        }
        res.status(500).json({ message: err.message });
    }
});

// Refresh JWT token
/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh JWT token
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Unauthorized, token invalid or expired
 */
router.post('/refresh-token', authenticateToken, (req, res) => {
    const token = jwt.sign({ id: req.user.id, username: req.user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

module.exports = router;

function generateRandomPassword() {
    const length = 8;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}
