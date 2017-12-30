const _ = require('lodash');
const app = require('..');
const config = require('../src/config');
const { ensureFolder } = require('../src/p6Static');

const createFolder = async appConfig => {
  await ensureFolder(appConfig.folders);
  const cacheSizeFolders = _.map(
    _.assign({ full: true }, appConfig.sizes),
    (sizeValue, sizeName) => `${appConfig.folders.cache}/${sizeName}`
  );
  await ensureFolder(cacheSizeFolders);
  return appConfig.folders;
};

createFolder(config).then(() => {
  const port = process.env.PORT || 9999;
  app.listen(port);
});
