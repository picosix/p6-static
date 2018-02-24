const fs = require("fs");
const path = require("path");
const util = require("util");

const db = require("../db");
const { folders } = require("../settings");

const unlink = util.promisify(fs.unlink);
const readdir = util.promisify(fs.readdir);

module.exports = async (req, res, next) => {
  try {
    const files = await readdir(folders.cache);

    const queue = files
      .filter(file => file[0] !== ".")
      .map(file => unlink(path.resolve(folders.cache, file)));

    // Delete on disk
    await Promise.all(queue);
    // Delete on db
    await db.model("Cache").remove();

    return res.json({ data: files });
  } catch (error) {
    return next(error);
  }
};
