const path = require("path");
const fs = require("fs");
const util = require("util");

const { folders } = require("../settings");
const transform = require("../../transform");

// Make sure statt will not throw an error
const stat = util.promisify(fs.stat);
const ALLOW_TYPES = ["resize", "crop"];
const EMBED_ALLOW_POSITIONS = [
  "north",
  "northeast",
  "east",
  "southeast",
  "south",
  "southwest",
  "west",
  "northwest",
  "center",
  "centre"
];
const EMBED_DEFAULT_POSITION = "southwest";

module.exports = async (req, res, next) => {
  try {
    const { type, size, name } = req.params;

    // Type must be allowed
    if (ALLOW_TYPES.indexOf(type) < 0) {
      return next(
        new Error(`Invalid type. It must be "${ALLOW_TYPES.join('" or "')}"`)
      );
    }
    const sizes = Object.keys(transform[type]);
    // Size must be allowed
    if (!transform[type][size]) {
      return next(
        new Error(`Invalid size. It must be "${sizes.join('" or "')}"`)
      );
    }
    // Image must be exist
    const resoucePath = path.resolve(folders.resource, name);

    // Resouce file is not exist
    if (!(await stat(resoucePath)).isFile()) {
      return next(new Error("File is not found :("));
    }
    // Find the cache path
    const cachePath = path.resolve(folders.cache, `${type}-${size}-${name}`);
    // Store resouce file in request lifetime
    req.folders = { resource: resoucePath, cache: cachePath };

    // Store the request size
    const transformSize = transform[type][size];
    // Transform size is number
    if (typeof transformSize === "number") {
      req.size = transformSize;
    } else if (
      // Transform size is object contain "value" properties
      typeof transformSize === "object" &&
      typeof transformSize.value === "number"
    ) {
      req.size = transformSize.value;
    } else {
      // Just store transform "width" and "height"
      req.size = {
        width: transformSize.width,
        height: transformSize.height
      };
    }

    // Store the embed
    if (typeof transformSize.embed === "object") {
      // Embed file is not exist
      if (
        !transformSize.embed.path ||
        !(await stat(transformSize.embed.path)).isFile()
      ) {
        return next(new Error("Embed file is not found :("));
      }

      // Use default position if it is not defined
      if (!transformSize.embed.position) {
        transformSize.embed.position = EMBED_DEFAULT_POSITION;
      }
      // Embed position is not allowed
      if (EMBED_ALLOW_POSITIONS.indexOf(transformSize.embed.position) < 0) {
        return next(
          new Error(
            `Invalid embed file position. It must be "${EMBED_ALLOW_POSITIONS.join(
              '" or "'
            )}"`
          )
        );
      }

      if (!transformSize.embed.size) transformSize.embed.size = 0.25;
      if (typeof transformSize.embed.size !== "number") {
        return next(
          new Error("Embed image size must be a number on range 0 < size <= 1 ")
        );
      }

      req.embed = transformSize.embed;
    }

    return next();
  } catch (error) {
    return next(error);
  }
};
