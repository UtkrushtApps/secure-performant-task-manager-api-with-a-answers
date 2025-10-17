// src/db/migrations/202306221_task_manager.js
exports.up = async function(knex) {
  await knex.schema
    .createTable('users', t => {
      t.increments('id').primary();
      t.string('username').notNullable().unique();
      t.string('email').notNullable().unique();
      t.string('password_hash').notNullable();
      t.enum('role', ['user', 'admin']).notNullable().defaultTo('user');
      t.timestamps(true, true);
    })
    .createTable('projects', t => {
      t.increments('id').primary();
      t.string('name').notNullable();
      t.text('description');
      t.integer('owner_id').references('users.id').notNullable().onDelete('CASCADE');
      t.timestamps(true, true);
    })
    .createTable('tasks', t => {
      t.increments('id').primary();
      t.string('title').notNullable();
      t.text('description');
      t.enum('status', ['todo', 'in_progress', 'done']).notNullable().defaultTo('todo');
      t.integer('project_id').references('projects.id').onDelete('CASCADE').notNullable();
      t.integer('user_id').references('users.id').onDelete('CASCADE').notNullable();
      t.timestamp('due_at');
      t.timestamps(true, true);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('tasks')
    .dropTableIfExists('projects')
    .dropTableIfExists('users');
};
