// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const userService = require('../services/users');
const { JWT_SECRET } = require('../config');

exports.authenticate = async (req, res, next) => {
  const authHeader = req.header('Authorization') || '';
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }
  const token = authHeader.replace('Bearer ', '').trim();
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    // Fetch from DB to attach user object (for up-to-date data)
    const user = await userService.findById(payload.sub);
    if (!user) return res.status(401).json({ error: 'Invalid token' });
    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

exports.requireRole = (role) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  if (req.user.role !== role) return res.status(403).json({ error: 'Forbidden' });
  next();
};

exports.requireSelfOrRole = (role) => (req, res, next) => {
  const { id } = req.params; // expected resource id param
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  if (req.user.role === role) return next();
  if (Number(id) === Number(req.user.id)) return next();
  return res.status(403).json({ error: 'Forbidden' });
};
