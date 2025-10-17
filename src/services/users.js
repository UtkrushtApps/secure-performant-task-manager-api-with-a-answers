// src/services/users.js
const db = require('../db/knex');

exports.createUser = async (data) => {
  const [user] = await db('users').insert(data).returning(['id', 'username', 'email', 'role']);
  return user;
};

exports.findByUsername = async (username) => {
  return db('users').where({ username }).first();
};

exports.findById = async (id) => {
  return db('users').where({ id }).first();
};

exports.updateUser = async (id, changes) => {
  const [user] = await db('users').where({ id }).update(changes).returning(['id', 'username', 'email', 'role']);
  return user;
};

exports.deleteUser = async (id) => {
  return db('users').where({ id }).del();
};

exports.getUsers = async ({ page = 1, limit = 20 }) => {
  const q = db('users').select('id', 'username', 'email', 'role').orderBy('id')
    .limit(limit).offset((page - 1) * limit);
  const users = await q;
  const [{ count }] = await db('users').count('*');
  return {
    page: Number(page),
    pageSize: users.length,
    total: Number(count),
    users
  };
};
