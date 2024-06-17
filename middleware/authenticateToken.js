const jwt = require('jsonwebtoken');
const JWT_SECRET = '413F4428472B4B6250655368566D5970337336763979244226452948404D6351'; // Replace with your actual JWT secret key

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(401);
    }

    jwt.verify(token, JWT_SECRET, async (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = await User.findByPk(user.id);

        // Check if the user has ADMIN or SUPER_ADMIN role
        if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
            return res.status(403).json({ message: 'Unauthorized access' });
        }

        next();
    });
};

module.exports = authenticateToken;
