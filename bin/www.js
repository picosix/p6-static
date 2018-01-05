const app = require('..');
const { allowSizes, folders } = require('../src/config');
const { ensureCacheFolder } = require('../src/services/image');

ensureCacheFolder({
  cachePath: folders.cache,
  allowSizes
}).then(() => {
  const port = process.env.PORT || 9999;
  app.listen(port);
});
