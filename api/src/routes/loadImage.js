const sharp = require("sharp");

module.exports = async (req, res, next) => {
  try {
    const { resource } = req.folders;
    // Begin transform image to right size
    const image = sharp(resource);

    // Store the image instance
    req.image = image;
    // Store the image metadata
    req.metadata = await image.metadata();

    return next();
  } catch (error) {
    return next(error);
  }
};
