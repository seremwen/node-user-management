const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken'); // Your authenticateToken middleware
const User = require('../models/User'); // Your User model
const JWT_SECRET = 'your_jwt_secret'; // Replace with your actual JWT secret

// Function to generate a random password
const generateRandomPassword = () => {
    return crypto.randomBytes(8).toString('hex'); // 16 characters long password
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
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/register', async (req, res) => {
    try {
        const { username, first_name, last_name, email, status } = req.body;

        // Check if status is one of the allowed values
        if (!['ACTIVE', 'INACTIVE', 'SUSPENDED'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const password = generateRandomPassword(); // Generate a random password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ username, password: hashedPassword, first_name, last_name, email, status });
        res.status(201).json({ message: 'User created', user, password });
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

        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
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

