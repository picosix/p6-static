const db = require("../db");

module.exports = async (req, res, next, _id) => {
  try {
    const { _id } = req.params;

    const Image = db.model("Image");
    const image = await Image.findById(_id);
    if (!image) {
      return res
        .status(404)
        .json({ message: `Document with id #${_id} is not found` });
    }

    req.image = image;
    return next();
  } catch (error) {
    return next(error);
  }
};
