const _ = require('lodash');
const shelljs = require('shelljs');

const createFolder = async appConfig => {
  const { folders, sizes } = appConfig;

  // Create each folder if it's not eixst
  _.each(folders, folder => {
    if (!shelljs.test('-d', folder)) {
      shelljs.mkdir('-p', folder);
    }
  });

  // Create cache size folder
  _.each([..._.keys(sizes), 'full'], size => {
    const sizeCacheFolder = `${folders.cache}/${size}`;
    if (!shelljs.test('-d', sizeCacheFolder)) {
      shelljs.mkdir('-p', sizeCacheFolder);
    }
  });

  return true;
};

module.exports = { createFolder };
