const { Router } = require("express");
const jwt = require("express-jwt");

const {
  name,
  version,
  description,
  author,
  license
} = require("../../package");
const { auth } = require("../settings");

// Error handler
const errorHandler = require("./errorHandler");
// Auth
const login = require("./login");
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
// Auth
router.post("/login", login);
// Statistic
router.get("/statictis", jwt({ secret: auth.secreteKey }), statictis);
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
router.get(
  "/images",
  jwt({ secret: auth.secreteKey }),
  prepareQuery,
  queryImages
);
router.delete("/images", jwt({ secret: auth.secreteKey }), deleteImages);
router.delete("/images/cache", jwt({ secret: auth.secreteKey }), clearCache);
router.param("_id", checkImageId);
router.get("/images/:_id", jwt({ secret: auth.secreteKey }), queryImage);
router.delete("/images/:_id", jwt({ secret: auth.secreteKey }), deleteImage);
router.delete(
  "/images/:_id/cache",
  jwt({ secret: auth.secreteKey }),
  deleteCache
);
// Error handler
router.use(errorHandler);

module.exports = router;
