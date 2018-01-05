const fs = require('fs');
const bluebird = require('bluebird');
const _ = require('lodash');

/**
 * Ensure folder is exist
 * @param {object|array} folders All object or array of folders need creating
 * @returns {Promise}
 */
const folderMaker = async (folders = {}) => {
  // Check param type
  if (!_.isObject(folders) && !_.isArray(folders)) {
    return bluebird.reject(
      new Error('Folder parameter must be object or array')
    );
  }
  // Parameter is empty, nothing to do
  if (_.isEmpty(folders)) {
    return folders;
  }

  // Create folders
  const ensureQueue = _.map(
    folders,
    folderPath =>
      fs.existsSync(folderPath)
        ? bluebird.resolve(folderPath)
        : bluebird.promisify(fs.mkdir)(folderPath)
  );
  return bluebird.all(ensureQueue).then(() => bluebird.resolve(folders));
};

module.exports = { folderMaker };
