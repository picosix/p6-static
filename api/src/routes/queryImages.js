const db = require("../db");

module.exports = async (req, res, next) => {
  try {
    const Image = db.model("Image");
    const images = await Image.find();
    return res.json({ data: images });
  } catch (error) {
    return next(error);
  }
};
