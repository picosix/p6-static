const sharp = require("sharp");

const calculateSize = require("../calculateSize");

module.exports = async (req, res, next) => {
  try {
    // We don't hav embed settings, just go to next transform
    if (!res.locals.embed) return next();

    // Begin transform image to right size
    const image = sharp(res.locals.embed.path);
    // Original size of image
    const { width, height } = await image.metadata();
    // Get new with and height
    const newSize = calculateSize(width, height, res.locals.embed.size);
    // Transform to new size
    image.resize.apply(image, newSize);

    // Overlay with embed image
    res.locals.image.overlayWith(await image.toBuffer(), {
      gravity: res.locals.embed.position
    });

    // To go next middleware to continue transform
    return next();
  } catch (error) {
    return next(error);
  }
};
