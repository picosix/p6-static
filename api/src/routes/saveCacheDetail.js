const path = require("path");

const db = require("../db");

module.exports = async (req, res, next) => {
  try {
    const { type, size, name } = req.params;
    const image = await db
      .model("Image")
      .findOne({ name })
      .exec();
    // Image is not saved
    if (!image) return next();

    // Cache is exist
    const cache = await db
      .model("Cache")
      .findOne({ imageId: new db.Types.ObjectId(image._id), type, size })
      .exec();
    if (cache) return next();

    const { width, height, format } = await req.image.metadata();
    const { cache: cachePath } = req.folders;
    const { _id: imageId, size: fileSize } = image.toObject();

    const cacheDetail = {
      imageId,
      mimetype: `image/${format}`,
      path: cachePath,
      type,
      size,
      width,
      height
    };

    const Cache = db.model("Cache");
    await new Cache(cacheDetail).save();

    return next();
  } catch (error) {
    return next(error);
  }
};
