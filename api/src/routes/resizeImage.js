const calculateSize = require("../calculateSize");

module.exports = async (req, res, next) => {
  try {
    const { image } = req;
    // Get new with and height
    const newSize = calculateSize(
      req.metadata.width,
      req.metadata.height,
      req.size
    );
    // Transform to new size
    image.resize.apply(image, newSize);

    // To go next middleware to continue transform
    return next();
  } catch (error) {
    return next(error);
  }
};
