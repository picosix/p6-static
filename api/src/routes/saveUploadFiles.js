const sharp = require("sharp");

const db = require("../db");
const generateCacheUrl = require("../generateCacheUrl");

module.exports = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next(new Error("Upload failed"));
  }

  let images = [];
  const insertQueue = req.files.map(
    async ({ mimetype, filename: name, path, size }) => {
      const Image = db.model("Image");
      const cacheUrl = generateCacheUrl({ name });

      const { width, height } = await (await sharp(path)).metadata();
      // Convert to kb
      fileSize = Number((size / 1024).toFixed(2));

      const image = new Image({
        name,
        mimetype,
        path,
        width,
        height,
        fileSize
      });
      images.push({
        name,
        mimetype,
        url: cacheUrl,
        width,
        height,
        fileSize
      });
      return image.save();
    }
  );
  await Promise.all(insertQueue);

  req.images = images;
  return next();
};
