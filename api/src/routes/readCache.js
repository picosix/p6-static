const fs = require("fs");

module.exports = (req, res, next) => {
  const { cache } = req.folders;

  // Just a midleware for case nginx cannot serve that image
  // If cache path is exist, serve it
  if (fs.existsSync(cache)) return fs.createReadStream(cache).pipe(res);
  // Cache is not exist, go to next middleware to transform image
  return next();
};
