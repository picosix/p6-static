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

    // Delete on disk
    await Promise.all(deleteQueue);
    // Delete on db
    await db
      .model("Cache")
      .remove({ imageId: new db.Types.ObjectId(image._id) });

    return res.json({ data: cacheUrls });
  } catch (error) {
    return next(error);
  }
};
