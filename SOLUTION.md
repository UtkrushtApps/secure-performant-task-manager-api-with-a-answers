# Solution Steps

1. Set up environment configuration using dotenv and provide a sample .env.example file.

2. Initialize Knex for PostgreSQL connection pooling in src/db/knex.js. Create a migration to define 'users', 'projects', and 'tasks' tables, enforcing relationships and constraints.

3. Implement Express app in src/app.js with CORS, Helmet, custom logger, rate limiter, centralized error handler, JSON parsing, and Swagger endpoint.

4. Configure logger middleware using Winston and integrate with HTTP request logging via morgan.

5. Design rate limiting middleware using express-rate-limit and apply it early in the stack.

6. Write the centralized error-handling middleware to output structured error responses.

7. Use Joi-based validator middleware for requests: enforce strong validation on user, project, and task APIs.

8. Add JWT authentication middleware using jsonwebtoken, and custom role-based access/ownership logic.

9. In routes/users.js, define user registration, login, self-profile, admin list, patch/delete users with correct middleware for role and identity.

10. In routes/projects.js and routes/tasks.js, mount controllers; in both, enforce authentication, and apply per-method authorization where needed.

11. Implement users, projects, and tasks controller logic to support async/await, query filtering, pagination, strong error handling, and data integrity.

12. Refactor DB service modules: use Knex query builder everywhere, leverage transactions for task create/update, and use connection pooling.

13. Implement Swagger doc endpoint at /api/docs using OpenAPI 3 via swagger-jsdoc and swagger-ui-express.

14. Apply security best practices: use parameterized queries (Knex), input sanitization (Joi validators), security headers, and CORS.

15. Add Dockerfile for service deployment. Ensure use of dotenv for runtime config (no secrets hard-coded).

16. Export the app for server.js so it can be tested and run efficiently.

