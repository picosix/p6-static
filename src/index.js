const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cors = require('cors');

const { debug, allowHosts } = require('./settings');
const routes = require('./routes');
const logger = require('./libs/logger');

const app = express();
// Midleware
app.use(methodOverride());
app.use(
  cors({
    origin: allowHosts,
    optionsSuccessStatus: 200,
    preflightContinue: true
  })
);
// app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use(routes);

// Error handler
app.use((error, { params, url, body }, res, next) => {
  logger.log({
    level: 'error',
    message: error.message,
    meta: {
      category: 'http',
      error,
      params,
      url,
      body
    }
  });
  const message = debug
    ? error.message
    : 'An error encountered while processing images';
  res.status(500).json({ message });

  return next();
});

module.exports = app;
