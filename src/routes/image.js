const { Router } = require('express');
const _ = require('lodash');
const bluebird = require('bluebird');
const { resize, upload, generateCacheUrl } = require('../services/image');
const {
  folders,
  allowTypes,
  upload: uploadConfig,
  allowSizes
} = require('../config');
const { Image: ImageModel } = require('../db');

const router = Router();

// Upload images
router.post(
  '/upload',
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
            allowSizes
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
    const imageStream = await resize({
      size,
      name,
      resourcePath: folders.resource,
      cachePath: folders.cache,
      allowSizes
    });

    // Stream image
    res.append('p6-static', `${size} - ${name}`);
    return imageStream.pipe(res);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
