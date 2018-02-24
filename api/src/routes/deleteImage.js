const fs = require("fs");
const path = require("path");
const util = require("util");
const db = require("../db");

const generateCacheUrl = require("../generateCacheUrl");
const { folders } = require("../settings");

const unlink = util.promisify(fs.unlink);

module.exports = async (req, res, next) => {
  try {
    const image = req.image;
    const Image = db.model("Image");

    const cachePaths = generateCacheUrl({
      name: image.name,
      reutrnCachePath: true
    });

    const cacheUrls = generateCacheUrl({
      name: image.name
    });

    cachePaths.map(async cachePath =>
      unlink(path.resolve(folders.cache, cachePath))
        .then(cachePath => cachePath)
        .catch(() => {})
    );
    if (fs.existsSync(image.path)) await unlink(image.path);
    await image.remove();

    return res.status(204).end();
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
