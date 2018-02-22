const sharp = require("sharp");

module.exports = async (req, res, next) => {
  try {
    const { resource } = res.locals.folders;
    // Begin transform image to right size
    const image = sharp(resource);

    // Store the image instance
    res.locals.image = image;
    // Store the image metadata
    res.locals.metadata = await image.metadata();

    return next();
  } catch (error) {
    return next(error);
  }
};
