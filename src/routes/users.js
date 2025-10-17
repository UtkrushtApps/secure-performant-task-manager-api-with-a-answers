// src/routes/users.js
const express = require('express');
const controller = require('../controllers/users');
const auth = require('../middleware/auth');
const { validateUser, validateUserPatch } = require('../middleware/validators');
const router = express.Router();

router.post('/register', validateUser, controller.register);
router.post('/login', controller.login);
router.get('/me', auth.authenticate, controller.getMe);

// Only admins can see all users
router.get('/', auth.authenticate, auth.requireRole('admin'), controller.getAllUsers);
router.get('/:id', auth.authenticate, auth.requireSelfOrRole('admin'), controller.getUser);
router.patch('/:id', auth.authenticate, auth.requireSelfOrRole('admin'), validateUserPatch, controller.updateUser);
router.delete('/:id', auth.authenticate, auth.requireRole('admin'), controller.deleteUser);

module.exports = router;
