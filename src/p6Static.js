const fs = require('fs');
const _ = require('lodash');
const bluebird = require('bluebird');
const sharp = require('sharp');

const logger = require('./logger');

const DEFAULT_POSITION = 'southwest';
const ALLOW_POSITION = [
  'north',
  'northeast',
  'east',
  'southeast',
  'south',
  'southwest',
  'west',
  'northwest',
  'center',
  'centre'
];

/* eslint no-param-reassign: 0 */
const generateCacheUrl = (fileName, sizes = [], host = '') => {
  if (!_.isArray(sizes) || _.isEmpty(sizes)) {
    logger.error(
      'Invalid cache file size. It must be array and cannot be empty',
      {
        sizes,
        fileName
      }
    );
    throw new Error(
      'Invalid cache file size. It must be array and cannot be empty'
    );
  }

  if (!fileName) {
    logger.warn('Generate cache url with empty files', {
      sizes,
      fileName
    });
    return {};
  }

  return _.reduce(
    sizes,
    (result, size) => {
      const hostinger = _.isString(host) && host ? `//${host}` : '';
      result[size] = `${hostinger}/${size}/${fileName}`;
      return result;
    },
    {}
  );
};

const ensureFolder = async (folders = {}) => {
  if (_.isEmpty(folders)) return folders;

  const ensureQueue = _.map(
    folders,
    folderPath =>
      fs.existsSync(folderPath)
        ? bluebird.resolve(folderPath)
        : bluebird.promisify(fs.mkdir)(folderPath)
  );
  return bluebird.all(ensureQueue).then(() => bluebird.resolve(folders));
};

const ensureFolderCache = async (cachePath, sizes) => {
  // Create all size filders
  const cacheSizeFolders = _.map(
    _.assign({ full: true }, sizes),
    (sizeValue, sizeName) => `${cachePath}/${sizeName}`
  );
  return ensureFolder(cacheSizeFolders);
};

const resolveSize = (size, width, height) => {
  let imageWidth;
  let imageHeight;

  if (size === 'full') return { imageWidth: width, imageHeight: height };
  // Size is percent of original size
  if (_.isNumber(size)) {
    imageWidth = width * size;
    imageHeight = height * size;
    return { imageWidth, imageHeight };
  }

  // Size is absolute size
  if (
    _.isObject(size) &&
    _.isNumber(size.width) &&
    !_.isNaN(size.width) &&
    _.isNumber(size.height) &&
    !_.isNaN(size.height)
  ) {
    const { width: iw, height: ih } = size;
    imageWidth = iw;
    imageHeight = ih;
    return { imageWidth, imageHeight };
  }

  return {};
};

const resolveEmbedded = async (size, { src, sizes }) => {
  // Ensure image path is exist
  if (!src) {
    logger.warn(`Embedded image path is not eixst`, { src });
    return false;
  }

  const image = sharp(src);
  const imageMetadata = await image.metadata();

  // Test request size
  // Size FULL is special size, always exist
  const requestSize = sizes && sizes[size] ? sizes[size] : size;
  if (!requestSize && requestSize !== 'full') {
    logger.error('Request non-exist size', {
      type: 'embedded',
      imgPath: src,
      size: requestSize
    });
    return false;
  }

  // Caculate image size
  const { imageWidth, imageHeight } = resolveSize(
    requestSize,
    imageMetadata.width,
    imageMetadata.height
  );
  if (!imageWidth || !imageHeight) {
    logger.error('Cannot caculate image size', {
      type: 'embedded',
      size: requestSize,
      imageWidth,
      imageHeight
    });
    return false;
  }

  // Resize image
  image.resize(imageWidth, imageHeight);

  return image.toBuffer();
};

const resolveEmbeddedPosition = position => {
  let pos = position;
  if (ALLOW_POSITION.indexOf(pos) < 0) {
    logger.warn(`Embedded position is not allow. Used default position`, {
      position,
      DEFAULT_POSITION,
      ALLOW_POSITION
    });
    pos = DEFAULT_POSITION;
  }
  return pos;
};

const resize = async (imageId, size, opts = {}) => {
  // Ensure folder config is exist
  if (
    !_.isObject(opts.folders) ||
    !opts.folders.resource ||
    !opts.folders.cache
  ) {
    logger.error('Resource and cache folder is required', {
      folders: opts.folders
    });
    throw new Error(`Resource and cache folder is required`);
  }

  const imgPath = `${opts.folders.resource}/${imageId}`;
  // Test request image path
  if (!fs.existsSync(imgPath)) {
    logger.error('Image path is not exist', { imgPath });
    throw new Error(`Image ${imgPath} is not exist`);
  }

  // Test request size
  // Size FULL is special size, always exist
  const requestSize =
    opts && opts.sizes && opts.sizes[size] ? opts.sizes[size] : size;
  if (!requestSize && requestSize !== 'full') {
    logger.error('Request non-exist size', {
      type: 'requestImage',
      imgPath,
      size: requestSize
    });
    throw new Error(`Size ${requestSize} of image ${imageId} is not exist`);
  }

  const cacheFolder = `${opts.folders.cache}/${size}`;

  // If cache file is created, return a stream itself
  if (fs.existsSync(`${cacheFolder}/${imgPath}`)) {
    return fs.createReadStream(`${cacheFolder}/${imgPath}`);
  }

  const image = sharp(imgPath);
  const imageMetadata = await image.metadata();

  // Caculate image size
  const { imageWidth, imageHeight } = resolveSize(
    requestSize,
    imageMetadata.width,
    imageMetadata.height
  );
  if (!imageWidth || !imageHeight) {
    logger.error('Cannot caculate image size', {
      type: 'requestImage',
      size: requestSize,
      imageWidth,
      imageHeight
    });
    throw new Error(`Cannot serve ${imgPath} with size ${size}`);
  }

  // Resize image
  image.resize(imageWidth, imageHeight);

  // Provide invalid embedded config
  if (opts.embedded && !_.isObject(opts.embedded)) {
    logger.warn(
      `Expect embedded config is object. You give ${typeof opts.embedded}`,
      {
        embedded: opts.embedded
      }
    );
  }
  // Insert another image if embedded config is exist
  if (_.isObject(opts.embedded)) {
    const embeddedBuffer = await resolveEmbedded(size, opts.embedded || {});
    if (embeddedBuffer) {
      const gravity = resolveEmbeddedPosition(opts.embedded.position);
      image.overlayWith(embeddedBuffer, { gravity });
    }
  }

  // Write cache file
  image
    .clone()
    .toFile(`${cacheFolder}/${imageId}`)
    .catch(error => logger.error(error.message, { error }));

  // Return a stream
  return image;
};

module.exports = {
  ALLOW_POSITION,
  ensureFolder,
  ensureFolderCache,
  resize,
  generateCacheUrl
};
