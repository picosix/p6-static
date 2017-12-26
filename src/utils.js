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
  _.each(_.keys(sizes), size => {
    shelljs.mkdir('-p', `${folders.cache}/${size}`);
  });

  return true;
};

module.exports = { createFolder };
