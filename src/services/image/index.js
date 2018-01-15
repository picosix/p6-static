const fs = require('fs');
const sharp = require('sharp');
const multer = require('multer');
const _ = require('lodash');
const bluebird = require('bluebird');
const { caculateSize, caculateCompositePosition } = require('./resolver');
const logger = require('../../libs/logger');

/**
 * Resize image with specified size
 * @param {object} param Function parameter with {src, size}
 * @returns {Sharp}
 */
const resize = async ({ src, size }) => {
  const image = sharp(src);
  const imageMetadata = await image.metadata();

  // Check request size
  if (!size) {
    return bluebird.reject(new Error('Request invalid size'));
  }
  // Caculate image size
  const { width, height } = caculateSize({
    size,
    width: imageMetadata.width,
    height: imageMetadata.height
  });
  // Check caculated size
  if (!width || !height) {
    return bluebird.reject(new Error('Cannot caculate image size'));
  }

  // Resize
  return image.resize(width, height);
};

/**
 * Resize image and embedded image
 * @param {object} param Function parameter with {name, size, resourcePath, cachePath, allowSizes}
 * @returns {Promise|ReadStream}
 */
const resizeWithEmbedded = async ({
  name,
  size,
  resourcePath,
  cachePath,
  allowSizes = {},
  embedded
}) => {
  try {
    // Check name
    if (!_.isString(name)) {
      return bluebird.reject(new Error('Invalid image name'));
    }
    // Check size
    if (!_.isString(name)) {
      return bluebird.reject(new Error('Invalid image size'));
    }
    // Check resource folder is exist
    if (!resourcePath || !fs.existsSync(resourcePath)) {
      return bluebird.reject(new Error('Resource folder is not exist'));
    }
    // Check cache folder is exist
    if (!cachePath || !fs.existsSync(cachePath)) {
      return bluebird.reject(new Error('Cache folder is not exist'));
    }
    if (!_.isObject(allowSizes)) {
      return bluebird.reject(new Error('Invalid allow allowSizes'));
    }

    // Return ReadStream of existing cache file
    const cacheImage = `${cachePath}/${size}-${name}`;
    if (fs.existsSync(cacheImage)) {
      return fs.createReadStream(cacheImage);
    }

    const imagePath = `${resourcePath}/${name}`;
    // Check image is exist
    if (!fs.existsSync(imagePath)) {
      return bluebird.reject(new Error(`Image ${name} is not found`));
    }
    const requestSize = allowSizes[size] ? allowSizes[size] : size;
    const image = await resize({ src: imagePath, size: requestSize });

    // Embedded image
    if (embedded && embedded.src) {
      const embeddedRequestSize =
        _.isObject(embedded.allowSizes) && embedded.allowSizes[size]
          ? embedded.allowSizes[size]
          : 1;
      const embeddedImage = await resize({
        src: embedded.src,
        size: embeddedRequestSize
      });
      const gravity = caculateCompositePosition(embedded.position);
      image.overlayWith(await embeddedImage.toBuffer(), { gravity });
    }

    // Write cache file
    image
      .clone()
      .toFile(cacheImage)
      .catch(error =>
        logger.log({
          level: 'error',
          message: error.message,
          meta: { error, category: 'services.image.resizeWithEmbedded' }
        })
      );
    // Return ReadStream
    return image;
  } catch (error) {
    return bluebird.reject(error);
  }
};

/**
 * Return multer config for upload image
 * @param {object} param Function parameter with {path, allowTypes, config}
 * @returns {Multer}
 */
const upload = ({ resourcePath, allowTypes, config: uploadConfig }) => {
  // Define storage
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, `${resourcePath}`);
    },
    filename(req, { originalname, mimetype }, cb) {
      const nameSegments = originalname.split('.');
      const name = nameSegments[0] ? `-${nameSegments[0]}` : '';

      const mineTypeSegments = mimetype.split('/');
      const ext = mineTypeSegments[1] || 'jpeg';
      cb(null, `${Date.now()}${name}.${ext}`);
    }
  });
  // Defined file filter
  const fileFilter = (req, { mimetype }, cb) =>
    cb(null, Boolean(allowTypes.indexOf(mimetype) > -1));

  return multer({ storage, fileFilter, limits: uploadConfig });
};

/**
 * Return all cache url of all size
 * @param {object} param Function parameter with {name, allowSizes}
 * @throws {Error}
 * @returns {object}
 */
const generateCacheUrl = ({ name, allowSizes, host }) => {
  // Chekc name
  if (!_.isString(name)) {
    throw new Error('Image name cannot be blank');
  }
  // Check type of allowSizes parameter
  if (!_.isObject(allowSizes)) {
    throw new Error('Image allowSizes must be object');
  }
  // Check allowSizes
  if (_.isEmpty(allowSizes)) {
    throw new Error(`Image allowSizes cannot be blank`);
  }

  /* eslint no-param-reassign: 0 */
  return _.reduce(
    allowSizes,
    (result, sizeVal, sizeName) => {
      const hostinger = _.isString(host) ? host : '';
      result[sizeName] = `${hostinger}/image/${sizeName}/${name}`;
      return result;
    },
    {}
  );
};

module.exports = {
  resize,
  resizeWithEmbedded,
  upload,
  generateCacheUrl
};
