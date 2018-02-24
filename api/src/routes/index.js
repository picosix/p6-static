const { Router } = require("express");

const {
  name,
  version,
  description,
  author,
  license
} = require("../../package");
// Error handler
const errorHandler = require("./errorHandler");
// Upload
const upload = require("./upload");
const saveUploadFiles = require("./saveUploadFiles");
// Query images
const prepareQuery = require("./prepareQuery");
const queryImages = require("./queryImages");
const clearCache = require("./clearCache");
const checkImageId = require("./checkImageId");
const queryImage = require("./queryImage");
const deleteCache = require("./deleteCache");
// Transform image
const validate = require("./validate");
const readCache = require("./readCache");
const loadImage = require("./loadImage");
const resizeImage = require("./resizeImage");
const transformType = require("./transformType");
const embed = require("./embed");
const renderImage = require("./renderImage");
const writeCache = require("./writeCache");

const router = Router();

// Root
router.get("/", (req, res) =>
  res.json({ name, version, description, author, license })
);
// Upload image
router.post(
  "/upload",
  upload().array("images"),
  saveUploadFiles,
  (req, res) => {
    return res.json(res.locals.images);
  }
);
// Transform the image
router.get(
  "/:type/:size/:name",
  validate,
  readCache,
  loadImage,
  resizeImage,
  transformType,
  embed,
  renderImage,
  writeCache
);
router.get("/images", prepareQuery, queryImages);
router.delete("/images/cache", clearCache);
router.param("_id", checkImageId);
router.get("/images/:_id", queryImage);
router.delete("/images/:_id/cache", deleteCache);
// Error handler
router.use(errorHandler);

module.exports = router;
