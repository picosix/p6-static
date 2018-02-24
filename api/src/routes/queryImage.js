const findDefaultSize = require("../findDefaultSize");
const generateCacheUrl = require("../generateCacheUrl");
const { domain } = require("../settings");

module.exports = async (req, res, next) => {
  try {
    const { includeDomain = 1 } = req.query;
    const image = req.image

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
