const { Router } = require('express');
const _ = require('lodash');
const bluebird = require('bluebird');
const cors = require('cors');
const {
  resizeWithEmbedded,
  upload,
  generateCacheUrl
} = require('../services/image');
const {
  folders,
  allowTypes,
  upload: uploadConfig,
  allowSizes,
  embedded,
  allowHosts,
  host
} = require('../settings');
const { Image: ImageModel } = require('../db');

const router = Router();
const corsFilter = cors({
  origin(origin, cb) {
    if (allowHosts.indexOf(origin) < 0) {
      return cb(new Error(`${origin} is not allowed`));
    }
    return cb(null, true);
  },
  preflightContinue: true,
  optionsSuccessStatus: 200
});

// Upload images
router.post(
  '/upload',
  corsFilter,
  upload({ resourcePath: folders.resource, allowTypes, uploadConfig }).array(
    'images'
  ),
  async ({ files }, res, next) => {
    try {
      const insertQueue = [];
      const images = [];

      _.each(files, ({ filename, path: imagePath, size }) => {
        // Create queue to save image information
        const model = new ImageModel({
          name: filename,
          path: imagePath,
          size
        });
        insertQueue.push(model.save());

        // Prepare image urls return to client
        images.push({
          name: filename,
          url: generateCacheUrl({
            name: filename,
            allowSizes,
            host
          })
        });
      });

      // Save images
      await bluebird.all(insertQueue);

      // Return images to client
      return res.json({ images });
    } catch (error) {
      return next(error);
    }
  }
);

// Get image
router.get('/:size/:name', async ({ params }, res, next) => {
  try {
    const { size, name } = params;

    // Create image ReadStream
    const imageStream = await resizeWithEmbedded({
      size,
      name,
      resourcePath: folders.resource,
      cachePath: folders.cache,
      allowSizes,
      embedded
    });

    // Stream image
    return imageStream.pipe(res);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
