const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const multer = require('multer');
const _ = require('lodash');
const slug = require('slug');
const sharp = require('sharp');
const shelljs = require('shelljs');

const config = require('./config');
const { createFolder } = require('./utils');

const app = express();

// Midleware
app.use(bodyParser.json());
app.use(methodOverride());

// Routes
const packageJson = require('../package.json');
// Root
app.get('/', (req, res) =>
  res.json(
    _.pick(packageJson, ['name', 'version', 'description', 'author', 'license'])
  )
);
// Upload
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, `${config.folders.resource}`);
  },
  filename(req, { originalname, mimetype }, cb) {
    const nameSegments = originalname.split('.');
    const name = slug(nameSegments[0], { lower: true });

    const mineTypeSegments = mimetype.split('/');
    const ext = mineTypeSegments[1] || 'jpeg';

    cb(null, `${Date.now()}-${name}.${ext}`);
  }
});
const fileFilter = (req, { mimetype }, cb) =>
  cb(null, Boolean(config.allowTypes.indexOf(mimetype) > -1));
const upload = multer({ storage, fileFilter, limits: config.upload });
// Only allow upload with fields images
app.post('/upload', upload.array('images'), ({ files }, res) =>
  res.json({ files })
);

// Serve image
app.get('/images/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { size = 'full' } = req.query;
    const imageSrc = `${config.folders.resource}/${id}`;

    // Check image size
    const imageSize = config.sizes[size];
    if (!imageSize && size !== 'full') {
      throw new Error(`Image size is invalid #${size}`);
    }

    // Serve cache file
    const cacheFolder = `${config.folders.cache}/${size}`;
    if (shelljs.test('-f', `${cacheFolder}/${id}`)) {
      return fs.createReadStream(`${cacheFolder}/${id}`).pipe(res);
    }

    // Caculate width and height
    let imageWidth;
    let imageHeight;
    const image = sharp(imageSrc);
    const imageMetadata = await image.metadata();
    if (_.isNumber(imageSize)) {
      imageWidth = imageMetadata.width * imageSize;
      imageHeight = imageMetadata.height * imageSize;
    }
    if (
      _.isObject(imageSize) &&
      _.isNumber(imageSize.width) &&
      _.isNumber(imageSize.height)
    ) {
      const { width: iw, height: ih } = imageSize;
      imageWidth = iw;
      imageHeight = ih;
    }

    // Embeded another image
    if (config.embeddedImage && shelljs.test('-f', config.embeddedImage.src)) {
      let embeddedWidth;
      let embeddedHeight;
      const embedded = sharp(config.embeddedImage.src);
      const embeddedMetadata = await embedded.metadata();
      const embeddedSize = config.embeddedImage.sizes[size];

      // Resize embedded image with percent
      if (_.isNumber(embeddedSize)) {
        embeddedWidth = embeddedMetadata.width * embeddedSize;
        embeddedHeight = embeddedMetadata.height * embeddedSize;
      }
      // Resize embedded image with absolute size
      if (
        _.isObject(embeddedSize) &&
        _.isNumber(embeddedSize.width) &&
        _.isNumber(embeddedSize.height)
      ) {
        const { width: iw, height: ih } = embeddedSize;
        embeddedWidth = iw;
        embeddedHeight = ih;
      }
      // Only resize embedded image if both width and height is truthy
      if (embeddedWidth && embeddedHeight) {
        embedded.resize(embeddedWidth, embeddedHeight);
      }

      const allowGravities = [
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
      const gravity =
        allowGravities.indexOf(config.embeddedImage.position) > -1
          ? config.embeddedImage.position
          : 'southwest';
      // Set embedded image
      image.overlayWith(await embedded.toBuffer(), { gravity });
    }

    // Only resize image if both width and height is truthy
    if (imageWidth && imageHeight) {
      image.resize(imageWidth, imageHeight);
    }
    // Write cache file
    image
      .clone()
      .toFile(`${cacheFolder}/${id}`)
      .catch(console.log);
    // Serve image
    return image.pipe(res);
  } catch (err) {
    return next(err);
  }
});

// Clear cache
app.delete('/cache', async (req, res) => {
  shelljs.rm('-rf', `${config.folders.cache}/*`);
  await createFolder(config);
  res.json({});
});

// Error handler
app.use((err, req, res, next) => {
  const message = config.debug
    ? err.message
    : 'An error encountered while processing images';
  res.json({ message });
  return next();
});

module.exports = app;
