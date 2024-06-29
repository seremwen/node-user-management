const jwt = require('jsonwebtoken');
const JWT_SECRET = '413F4428472B4B6250655368566D5970337336763979244226452948404D6351'; // Replace with your actual JWT secret key
const User  = require('../models/User'); // Adjust the import path as per your application's structure

const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.sendStatus(401); // Unauthorized
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.sendStatus(403); // Forbidden
        }

        // Check if the user has ADMIN or SUPER_ADMIN role
        if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
            return res.status(403).json({ message: 'Unauthorized access' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(403).json({ message: 'Forbidden' });
    }
};

module.exports = authenticateToken;
