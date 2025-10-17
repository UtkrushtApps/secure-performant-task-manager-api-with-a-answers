// src/config.js
require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET || 'change_this_secret',
  DB: {
    client: 'pg',
    connection: {
      host: process.env.PGHOST || 'localhost',
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || 'postgres',
      database: process.env.PGDATABASE || 'task_manager',
      port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432
    },
    pool: {
      min: 2,
      max: 15
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
};
