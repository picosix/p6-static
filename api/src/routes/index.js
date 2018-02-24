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
// Statictis
const statictis = require("./statictis");
// Upload
const upload = require("./upload");
const saveUploadFiles = require("./saveUploadFiles");
// Query images
const prepareQuery = require("./prepareQuery");
const queryImages = require("./queryImages");
const deleteImages = require("./deleteImages");
const clearCache = require("./clearCache");
const checkImageId = require("./checkImageId");
const queryImage = require("./queryImage");
const deleteImage = require("./deleteImage");
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
const saveCacheDetail = require("./saveCacheDetail");

const router = Router();

// Root
router.get("/", (req, res) => {
  res.json({ name, version, description, author, license });
});
router.get("/statictis", statictis);
// Upload image
router.post(
  "/upload",
  upload().array("images"),
  saveUploadFiles,
  (req, res) => {
    return res.json(req.images);
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
  saveCacheDetail,
  writeCache
);
router.get("/images", prepareQuery, queryImages);
router.delete("/images", deleteImages);
router.delete("/images/cache", clearCache);
router.param("_id", checkImageId);
router.get("/images/:_id", queryImage);
router.delete("/images/:_id", deleteImage);
router.delete("/images/:_id/cache", deleteCache);
// Error handler
router.use(errorHandler);

module.exports = router;
