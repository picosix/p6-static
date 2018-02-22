const multer = require("multer");
const { folders, allowTypes, uploadLimits } = require("../settings");

module.exports = () => {
  // Define storage
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, `${folders.resource}`);
    },
    filename(req, { originalname }, cb) {
      cb(null, `${Date.now()}-${originalname}`);
    }
  });
  // Defined file filter
  const fileFilter = (req, { mimetype }, cb) =>
    cb(null, Boolean(allowTypes.indexOf(mimetype) > -1));

  return multer({ storage, fileFilter, limits: uploadLimits });
};
