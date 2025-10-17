// src/routes/projects.js
const express = require('express');
const controller = require('../controllers/projects');
const auth = require('../middleware/auth');
const { validateProject, validateProjectPatch } = require('../middleware/validators');

const router = express.Router();

router.use(auth.authenticate);

router.get('/', controller.listProjects);
router.post('/', validateProject, controller.createProject);
router.get('/:id', controller.getProject);
router.patch('/:id', validateProjectPatch, controller.updateProject);
router.delete('/:id', auth.requireRole('admin'), controller.deleteProject);

module.exports = router;
