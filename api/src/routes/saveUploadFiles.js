const db = require("../db");
const generateCacheUrl = require("../generateCacheUrl");

module.exports = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next(new Error("Upload failed"));
  }

  let images = [];
  const insertQueue = req.files.map(
    ({ mimetype, filename: name, path, size }) => {
      const Image = db.model("Image");
      const cacheUrl = generateCacheUrl(name, true);

      // Convert to kb
      size = Number((size / 1024).toFixed(2));
      const image = new Image({
        name,
        mimetype,
        path,
        size
      });
      images.push({
        name,
        mimetype,
        url: cacheUrl,
        size
      });
      return image.save();
    }
  );
  await Promise.all(insertQueue);

  res.locals.images = images;
  return next();
};
