const calculateSize = require("../calculateSize");

module.exports = async (req, res, next) => {
  try {
    const { image } = res.locals;
    // Get new with and height
    const newSize = calculateSize(
      res.locals.metadata.width,
      res.locals.metadata.height,
      res.locals.size
    );
    // Transform to new size
    image.resize.apply(image, newSize);

    // To go next middleware to continue transform
    return next();
  } catch (error) {
    return next(error);
  }
};
