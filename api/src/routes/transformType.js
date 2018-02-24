const ALLOW_TRANSFORM_TYPES = ["jpeg", "png", "webp"];

module.exports = async (req, res, next) => {
  try {
    const { format } = req.metadata;
    // The image type is not valid to transform, just use original type
    if (!format || ALLOW_TRANSFORM_TYPES.indexOf(format) < 0) {
      return next();
    }

    req.image[format]();
    return next();
  } catch (error) {
    return next(error);
  }
};
