// src/app.js
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimiter = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./middleware/logger');
const { swaggerUi, swaggerSpec } = require('./swagger/swagger');

const userRoutes = require('./routes/users');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');

const app = express();

// Trust proxy for rate limiting behind proxies
app.set('trust proxy', 1);

// Middleware order matters!
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('combined', { stream: logger.stream }));
app.use(rateLimiter);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// Swagger OpenAPI doc
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

// Centralized error handling
app.use(errorHandler);

module.exports = app;
