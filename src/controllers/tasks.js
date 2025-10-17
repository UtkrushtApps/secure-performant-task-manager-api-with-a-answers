// src/controllers/tasks.js
const taskService = require('../services/tasks');
const { handleControllerError } = require('../utils/error');

exports.listTasks = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, project_id, user_id, status } = req.query;
    // Only allow admin to query any user's tasks
    let filterUserId = user_id ? parseInt(user_id) : req.user.role === 'admin' ? undefined : req.user.id;
    if (req.user.role !== 'admin') {
      filterUserId = req.user.id;  // User cannot query other users' tasks
    }
    const filter = {};
    if (project_id) filter.project_id = project_id;
    if (status) filter.status = status;
    if (filterUserId) filter.user_id = filterUserId;
    const data = await taskService.listTasks({ page, limit, filter });
    return res.json(data);
  } catch (e) { handleControllerError(e, res, next); }
};

exports.createTask = async (req, res, next) => {
  try {
    // Only allow creating task for current user unless admin
    let user_id = req.body.user_id || req.user.id;
    if (req.user.role !== 'admin' && user_id !== req.user.id) {
      return res.status(403).json({ error: 'Cannot assign tasks to other users' });
    }
    // Transaction for atomic creation
    const task = await taskService.createTaskTransactional({ ...req.body, user_id });
    return res.status(201).json(task);
  } catch (e) { handleControllerError(e, res, next); }
};

exports.getTask = async (req, res, next) => {
  try {
    const task = await taskService.getTask(req.params.id);
    if (!task) return res.status(404).json({ error: 'Not found' });
    if (req.user.role !== 'admin' && task.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    return res.json(task);
  } catch (e) { handleControllerError(e, res, next); }
};

exports.updateTask = async (req, res, next) => {
  try {
    // Only admins or owner can update
    const { id } = req.params;
    const task = await taskService.getTask(id);
    if (!task) return res.status(404).json({ error: 'Not found' });
    if (req.user.role !== 'admin' && task.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    // Transactional update
    const updated = await taskService.updateTaskTransactional(id, req.body);
    return res.json(updated);
  } catch (e) { handleControllerError(e, res, next); }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const task = await taskService.getTask(req.params.id);
    if (!task) return res.status(404).json({ error: 'Not found' });
    if (req.user.role !== 'admin' && task.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    await taskService.deleteTask(req.params.id);
    return res.status(204).send();
  } catch (e) { handleControllerError(e, res, next); }
};
