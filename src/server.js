// src/server.js
const app = require('./app');
const { PORT } = require('./config');

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Task manager API listening on port ${PORT}`);
});
