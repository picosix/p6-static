const db = require("../db");
const findDefaultSize = require("../findDefaultSize");
const generateCacheUrl = require("../generateCacheUrl");
const { domain } = require("../settings");

module.exports = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const { includeDomain = 1 } = req.query;

    const Image = db.model("Image");
    const image = await Image.findById(_id);
    if (!image) {
      return res
        .status(404)
        .json({ message: `Document with id #${_id} is not found` });
    }

    const cacheUrls = generateCacheUrl({
      name: image.name,
      domain: !!Number(includeDomain) ? domain : ""
    });
    const defaultSize = findDefaultSize({
      name: image.name,
      domain: !!Number(includeDomain) ? domain : ""
    });

    res.json({
      data: Object.assign({}, image.toObject(), {
        defaultSize,
        cacheUrls,
        path: ""
      })
    });
  } catch (error) {
    return next(error);
  }
};
