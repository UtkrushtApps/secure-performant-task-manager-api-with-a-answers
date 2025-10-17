// src/controllers/users.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userService = require('../services/users');
const { JWT_SECRET } = require('../config');
const { handleControllerError } = require('../utils/error');

exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 chars' });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await userService.createUser({ username, email, password_hash: hash });
    return res.status(201).json({ id: user.id, username: user.username, email: user.email, role: user.role });
  } catch (e) {
    handleControllerError(e, res, next);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await userService.findByUsername(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    // JWT: subject is user id, payload includes role
    const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: '12h' });
    return res.status(200).json({ token });
  } catch (e) {
    handleControllerError(e, res, next);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    return res.json({ id: req.user.id, username: req.user.username, email: req.user.email, role: req.user.role });
  } catch (e) {
    handleControllerError(e, res, next);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    // pagination
    const { page = 1, limit = 20 } = req.query;
    const data = await userService.getUsers({ page, limit });
    return res.json(data);
  } catch (e) {
    handleControllerError(e, res, next);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await userService.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json(user);
  } catch (e) {
    handleControllerError(e, res, next);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    // Only email and username are updatable
    const { email, username } = req.body;
    const user = await userService.updateUser(req.params.id, { email, username });
    return res.json({ id: user.id, username: user.username, email: user.email, role: user.role });
  } catch (e) {
    handleControllerError(e, res, next);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id);
    return res.status(204).send();
  } catch (e) {
    handleControllerError(e, res, next);
  }
};
