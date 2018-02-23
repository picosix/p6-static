const db = require("../db");
const findDefaultSize = require("../findDefaultSize");
const generateCacheUrl = require("../generateCacheUrl");
const { domain } = require("../settings");

module.exports = async (req, res, next) => {
  try {
    let data = [];
    const { includeDomain = 1 } = req.query;
    const Image = db.model("Image");
    const images = await Image.find();

    for (let i = 0; i < images.length; i++) {
      const image = images[i].toObject();
      const { cacheUrl: src } = findDefaultSize({
        name: image.name,
        domain: !!Number(includeDomain) ? domain : ""
      });
      data.push(
        Object.assign(image, {
          src,
          path: ""
        })
      );
    }

    return res.json({ data });
  } catch (error) {
    return next(error);
  }
};
