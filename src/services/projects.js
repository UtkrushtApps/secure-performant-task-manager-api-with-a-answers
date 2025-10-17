// src/services/projects.js
const db = require('../db/knex');

exports.listProjects = async ({ page = 1, limit = 20, filter = {} }) => {
  const query = db('projects').select('*').orderBy('id');
  if (filter.owner_id) {
    query.where('owner_id', filter.owner_id);
  }
  query.limit(limit).offset((page - 1) * limit);
  const projects = await query;
  const [{ count }] = await db('projects').where(filter).count('*');
  return {
    page: Number(page),
    pageSize: projects.length,
    total: Number(count),
    projects,
  };
};

exports.createProject = async (obj) => {
  const [project] = await db('projects').insert(obj).returning('*');
  return project;
};

exports.getProject = async (id) => {
  return db('projects').where({ id }).first();
};

exports.updateProject = async (id, changes) => {
  const [project] = await db('projects').where({ id }).update(changes).returning('*');
  return project;
};

exports.deleteProject = async (id) => {
  return db('projects').where({ id }).del();
};
