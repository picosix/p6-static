const fs = require('fs');
const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('..');
const config = require('../src/config');

const { assert } = chai;
chai.use(chaiHttp);

describe('[Interaction test] Clear cache', () => {
  let server;

  before(async () => {
    server = chai.request(app);
  });

  it('should clear all cache images', async () => {
    const { status, body } = await server
      .post('/cache')
      .set('X-HTTP-Method-Override', 'DELETE');
    // Assert
    assert.equal(status, 200);
    assert.isObject(body);
    assert.notExists(body.errorCode);

    return new Promise(resolve =>
      fs.readdir(config.folders.cache, (err, files) => {
        assert.isNotOk(err);
        assert.equal(
          files.filter(file => file[0] !== '.').length,
          Object.keys(config.sizes).length + 1 // size "full" is always exist
        );
        return resolve(true);
      })
    );
  });
});
