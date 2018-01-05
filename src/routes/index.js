const { Router } = require('express');
const _ = require('lodash');
const imageRouter = require('./image');

const router = Router();

const packageJson = require('../../package.json');
// Show project information
router.get('/', (req, res) =>
  res.json(
    _.pick(packageJson, ['name', 'version', 'description', 'author', 'license'])
  )
);
// Image router
router.use('/image', imageRouter);

module.exports = router;
