// src/controllers/projects.js
const projectService = require('../services/projects');
const { handleControllerError } = require('../utils/error');

exports.listProjects = async (req, res, next) => {
  try {
    // Filtering & pagination
    const { page = 1, limit = 20, owner_id } = req.query;
    const filter = owner_id ? { owner_id } : {};
    const data = await projectService.listProjects({ page, limit, filter });
    res.json(data);
  } catch (e) { handleControllerError(e, res, next); }
};

exports.createProject = async (req, res, next) => {
  try {
    const owner_id = req.user.id;
    const project = await projectService.createProject({ ...req.body, owner_id });
    res.status(201).json(project);
  } catch (e) { handleControllerError(e, res, next); }
};

exports.getProject = async (req, res, next) => {
  try {
    const project = await projectService.getProject(req.params.id);
    if (!project) return res.status(404).json({ error: 'Not found' });
    res.json(project);
  } catch (e) { handleControllerError(e, res, next); }
};

exports.updateProject = async (req, res, next) => {
  try {
    // Can't change owner via patch
    const update = { ...req.body };
    delete update.owner_id;
    const project = await projectService.updateProject(req.params.id, update);
    if (!project) return res.status(404).json({ error: 'Not found' });
    res.json(project);
  } catch (e) { handleControllerError(e, res, next); }
};

exports.deleteProject = async (req, res, next) => {
  try {
    await projectService.deleteProject(req.params.id);
    res.status(204).send();
  } catch (e) { handleControllerError(e, res, next); }
};
