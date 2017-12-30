const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const multer = require('multer');
const _ = require('lodash');
const slug = require('slug');
const shelljs = require('shelljs');

const config = require('./config');
const { ensureFolder, resize } = require('./p6Static');
const logger = require('./logger');

const app = express();
// Midleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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
  filename({ query = {} }, { originalname, mimetype }, cb) {
    const nameSegments = originalname.split('.');
    const name = slug(query.name ? query.name : nameSegments[0], {
      lower: true
    });

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
app.get('/image/:size/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { size = 'full' } = req.params;

    const imageStream = await resize(id, size, config);
    return imageStream.pipe(res);
  } catch (err) {
    return next(err);
  }
});

// Clear cache
app.delete('/cache', async (req, res) => {
  shelljs.rm('-rf', `${config.folders.cache}/*`);
  await ensureFolder(config.folders);
  const cacheSizeFolders = _.map(
    _.assign({ full: true }, config.sizes),
    (sizeValue, sizeName) => `${config.folders.cache}/${sizeName}`
  );
  await ensureFolder(cacheSizeFolders);
  res.json({});
});

// Error handler
app.use((err, req, res, next) => {
  logger.error(err.message, { error: err });
  const message = config.debug
    ? err.message
    : 'An error encountered while processing images';
  res.status(500).json({ message });

  return next();
});

module.exports = app;
