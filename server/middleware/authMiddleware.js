const jwt = require('jsonwebtoken');
const { memoryStore } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'local_job_portal_secret_key_2026';

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Look up user in memoryStore first, or set from decoded
      const user = memoryStore.users.find(u => u._id === decoded.id) || {
        _id: decoded.id,
        name: decoded.name || 'User',
        email: decoded.email,
        role: decoded.role
      };
      
      req.user = user;
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Role '${req.user?.role}' is not authorized to access this route` });
    }
    next();
  };
};

module.exports = { protect, authorize, JWT_SECRET };
