const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config/config');

const authenticateUser = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(403).json({ msg: 'No token provided' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(403).json({ msg: 'No token provided' });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            console.error('Token verification failed:', err);
            return res.status(401).json({ msg: 'Failed to authenticate token' });
        }

        req.userId = decoded.id;
        next();
    });
};

module.exports = authenticateUser;