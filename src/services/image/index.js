const fs = require('fs');
const sharp = require('sharp');
const multer = require('multer');
const _ = require('lodash');
const bluebird = require('bluebird');
const { caculateSize } = require('./resolver');
const { folderMaker } = require('../utils/ensurer');

/**
 * Resize image
 * @param {object} param Function parameter with {name, size, resourcePath, cachePath, allowSizes}
 */
const resize = async ({
  name,
  size,
  resourcePath,
  cachePath,
  allowSizes = {}
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
    const cacheImage = `${cachePath}/${size}/${name}`;
    if (fs.existsSync(cacheImage)) {
      return fs.createReadStream(cacheImage);
    }

    const imagePath = `${resourcePath}/${name}`;
    // Check image is exist
    if (!fs.existsSync(imagePath)) {
      return bluebird.reject(new Error(`Image ${name} is not found`));
    }
    const image = sharp(imagePath);
    const imageMetadata = await image.metadata();

    // Check request size
    const requestSize = allowSizes[size] ? allowSizes[size] : size;
    if (!requestSize && requestSize !== 'full') {
      return bluebird.reject(new Error('Request invalid size'));
    }
    // Caculate image size
    const { width, height } = caculateSize({
      size: requestSize,
      width: imageMetadata.width,
      height: imageMetadata.height
    });
    // Check caculated size
    if (!width || !height) {
      return bluebird.reject(new Error('Cannot caculate image size'));
    }

    // Resize
    image.resize(width, height);
    // Write cache file
    image
      .clone()
      .toFile(cacheImage)
      .catch(console.log);
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
const generateCacheUrl = ({ name, allowSizes }) => {
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
    _.assign({ full: 1 }, allowSizes),
    (result, size) => {
      result[size] = `/${size}/${name}`;
      return result;
    },
    {}
  );
};

/**
 * Ensure all cache folder of all size is exist
 * @param {object} param Function parameter with {path, allowSizes}
 * @throws {Error}
 * @returns {object}
 */
const ensureCacheFolder = async ({ cachePath, allowSizes }) => {
  // Check path
  if (!_.isString(cachePath)) {
    return bluebird.reject(new Error('Cache path cannot be blank'));
  }
  // Check type of allowSizes parameter
  if (!_.isObject(allowSizes)) {
    return bluebird.reject(new Error('Image allowSizes must be object'));
  }
  // Check allowSizes
  if (_.isEmpty(allowSizes)) {
    return bluebird.reject(new Error(`Image allowSizes cannot be blank`));
  }
  const cacheSizes = _.map(
    _.assign({ full: 1 }, allowSizes),
    (val, name) => `${cachePath}/${name}`
  );

  return folderMaker(cacheSizes);
};

module.exports = { resize, upload, generateCacheUrl, ensureCacheFolder };
