const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const cors = require("cors");

const { debug, port, allowHosts } = require("./settings");
const routes = require("./routes");

// Init app
const app = express();
// Settings
app.set("port", port);
// Midleware
app.use(methodOverride());
app.use(
  cors({
    origin: allowHosts,
    optionsSuccessStatus: 200,
    preflightContinue: true
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use(routes);

// Export app
module.exports = app;
