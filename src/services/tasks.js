// src/services/tasks.js
const db = require('../db/knex');

exports.listTasks = async ({ page = 1, limit = 20, filter = {} }) => {
  const query = db('tasks').select('*').orderBy('id');
  if (filter && Object.keys(filter).length > 0) {
    query.where(filter);
  }
  query.limit(limit).offset((page - 1) * limit);
  const tasks = await query;
  const countQuery = db('tasks').count('*');
  if (filter && Object.keys(filter).length > 0) {
    countQuery.where(filter);
  }
  const [{ count }] = await countQuery;
  return {
    page: Number(page),
    pageSize: tasks.length,
    total: Number(count),
    tasks,
  };
};

exports.createTaskTransactional = async (taskObj) => {
  return db.transaction(async trx => {
    // check user and project exist (prevent orphans)
    const user = await trx('users').where({ id: taskObj.user_id }).first();
    const project = await trx('projects').where({ id: taskObj.project_id }).first();
    if (!user || !project) {
      throw Object.assign(new Error('User or Project does not exist'), { status: 400 });
    }
    const [task] = await trx('tasks').insert(taskObj).returning('*');
    return task;
  });
};

exports.getTask = async (id) => {
  return db('tasks').where({ id }).first();
};

exports.updateTaskTransactional = async (id, changes) => {
  return db.transaction(async trx => {
    // Only update allowed fields
    const allowedFields = ['title', 'description', 'status', 'due_at', 'project_id'];
    const update = Object.fromEntries(Object.entries(changes).filter(([k]) => allowedFields.includes(k)));
    const [task] = await trx('tasks').where({ id }).update(update).returning('*');
    return task;
  });
};

exports.deleteTask = async (id) => {
  return db('tasks').where({ id }).del();
};
