const chai = require('chai');
const _ = require('lodash');
const { generateCacheUrl } = require('../../src/services/image');

const { assert } = chai;

describe('Generate cache url', () => {
  const imageName = 'the-fancy-image.png';
  const allowSizes = { full: 1, '70x80': { width: 70, height: 70 } };
  const host = '//static.picosix.local';

  it('should return all cache url base on allow sizes', async () => {
    const cacheUrls = generateCacheUrl({ name: imageName, allowSizes });

    assert.isObject(cacheUrls);
    _.each(cacheUrls, (url, name) => {
      assert.exists(allowSizes[name]);
      assert.equal(`/image/${name}-${imageName}`, url);
    });
  });

  it('should return all cache url with host base on allow sizes', async () => {
    const cacheUrls = generateCacheUrl({ name: imageName, allowSizes, host });

    assert.isObject(cacheUrls);
    _.each(cacheUrls, (url, name) => {
      assert.exists(allowSizes[name]);
      assert.equal(`${host}/image/${name}-${imageName}`, url);
    });
  });
});
