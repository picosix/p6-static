const fs = require('fs');
const chai = require('chai');
const _ = require('lodash');
const shell = require('shelljs');
const { ensureCacheFolder } = require('../../src/services/image');
const { folders, allowSizes } = require('../../src/settings');

const { assert } = chai;

describe('Generate cache url', () => {
  const cachePath = folders.cache;

  before(async () => {
    // Clear cache folders
    shell.rm('-rf', `${cachePath}/*`);
  });

  it('should create all cache folders', async () => {
    const cacheFolderPaths = await ensureCacheFolder({ cachePath, allowSizes });

    assert.isArray(cacheFolderPaths);
    _.each(cacheFolderPaths, cacheFolderPath => {
      assert.isOk(fs.existsSync(cacheFolderPath));
    });
  });
});
