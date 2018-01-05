const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const { debug } = require('./settings');
const routes = require('./routes');

const app = express();
// Midleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());

// Routes
app.use(routes);

// Error handler
app.use((err, req, res, next) => {
  const message = debug
    ? err.message
    : 'An error encountered while processing images';
  res.status(500).json({ message });
  console.log(err)

  return next();
});

module.exports = app;
