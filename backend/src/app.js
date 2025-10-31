const express = require('express');
const morgan = require('morgan');

const health = require('./routes/health');
const tasks = require('./routes/tasks');

const app = express();
app.use(morgan('dev'));
app.use(express.json({ limit: '10kb' }));

app.use('/api/health', health);
app.use('/api/tasks', tasks);

// erreur minimale
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'server_error' });
});

module.exports = app;
