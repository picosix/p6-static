const fs = require("fs");
const path = require("path");
const util = require("util");

const generateCacheUrl = require("../generateCacheUrl");
const { folders } = require("../settings");

const unlink = util.promisify(fs.unlink);

module.exports = async (req, res, next) => {
  try {
    const image = req.image;

    const cachePaths = generateCacheUrl({
      name: image.name,
      reutrnCachePath: true
    });

    const cacheUrls = generateCacheUrl({
      name: image.name
    });

    const deleteQueue = cachePaths.map(cachePath =>
      unlink(path.resolve(folders.cache, cachePath))
    );

    await Promise.all(deleteQueue);

    return res.json({ data: cacheUrls });
  } catch (error) {
    return next(error);
  }
};
