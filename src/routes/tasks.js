// src/routes/tasks.js
const express = require('express');
const controller = require('../controllers/tasks');
const auth = require('../middleware/auth');
const { validateTask, validateTaskPatch } = require('../middleware/validators');

const router = express.Router();

router.use(auth.authenticate);

// Filtering: by project_id, user_id, status
router.get('/', controller.listTasks);
router.post('/', validateTask, controller.createTask);
router.get('/:id', controller.getTask);
router.patch('/:id', validateTaskPatch, controller.updateTask);
router.delete('/:id', controller.deleteTask);

module.exports = router;
