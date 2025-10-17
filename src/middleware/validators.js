// src/middleware/validators.js
const Joi = require('joi');

const userSchema = Joi.object({
  username: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});
const userPatchSchema = Joi.object({
  username: Joi.string().min(2),
  email: Joi.string().email(),
});

const projectSchema = Joi.object({
  name: Joi.string().min(3).required(),
  description: Joi.string().allow(''),
});
const projectPatchSchema = Joi.object({
  name: Joi.string().min(3),
  description: Joi.string().allow(''),
});

const taskSchema = Joi.object({
  title: Joi.string().min(1).required(),
  description: Joi.string().allow(''),
  status: Joi.string().valid('todo', 'in_progress', 'done').optional(),
  project_id: Joi.number().integer().positive().required(),
  user_id: Joi.number().integer().positive(),
  due_at: Joi.date().optional().allow(null),
});
const taskPatchSchema = Joi.object({
  title: Joi.string().min(1),
  description: Joi.string().allow(''),
  status: Joi.string().valid('todo', 'in_progress', 'done'),
  due_at: Joi.date().allow(null),
  project_id: Joi.number().integer().positive(),
});

function makeValidator(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  };
}
module.exports = {
  validateUser: makeValidator(userSchema),
  validateUserPatch: makeValidator(userPatchSchema),
  validateProject: makeValidator(projectSchema),
  validateProjectPatch: makeValidator(projectPatchSchema),
  validateTask: makeValidator(taskSchema),
  validateTaskPatch: makeValidator(taskPatchSchema),
};
