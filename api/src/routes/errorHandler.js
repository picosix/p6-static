const { debug } = require("../settings");

module.exports = (error, req, res, next) => {
  const message = debug
    ? error.message
    : "An error encountered while processing your images";
  res.status(500).json({ message });

  return next();
};
