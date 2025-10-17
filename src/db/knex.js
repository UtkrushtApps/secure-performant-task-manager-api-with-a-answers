// src/db/knex.js
const knex = require('knex');
const { DB } = require('../config');

const db = knex(DB);

module.exports = db;
