const db = require("../db");
const findDefaultSize = require("../findDefaultSize");
const generateCacheUrl = require("../generateCacheUrl");
const { domain } = require("../settings");

module.exports = async (req, res, next) => {
  try {
    let data = [],
      query = {};
    const { includeDomain = 1, name } = req.query;
    const { skip, limit, sort } = req;

    if (name) query.name = new RegExp(name);

    const Image = db.model("Image");
    const images = await Image.find(query)
      .select({
        name: 1,
        mimetype: 1,
        fileSize: 1,
        createdAt: 1,
        updatedAt: 1
      })
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .exec();
    const total = await Image.count(query);

    for (let i = 0; i < images.length; i++) {
      const image = images[i].toObject();
      const { cacheUrl: src } = findDefaultSize({
        name: image.name,
        domain: !!Number(includeDomain) ? domain : ""
      });
      data.push(Object.assign(image, { src }));
    }

    return res.json({ total, data });
  } catch (error) {
    return next(error);
  }
};
