const sharp = require("sharp");

module.exports = async (req, res, next) => {
  try {
    const { type } = req.params;

    // Crop image by focus on the region with the highest Shannon entropy.
    if (type === "crop") {
      res.locals.image.crop(sharp.strategy.entropy);
    }

    // Clone new instance, serve it to client
    const image = res.locals.image.clone();
    image.pipe(res);

    // Go to next middleware to store the transformable image
    return next();
  } catch (error) {
    return next(error);
  }
};
