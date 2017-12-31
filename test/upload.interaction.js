const fs = require('fs');
const chai = require('chai');
const chaiHttp = require('chai-http');
const shelljs = require('shelljs');

const app = require('..');
const config = require('../src/config');

const { assert } = chai;
chai.use(chaiHttp);

describe('[Interaction test] Upload', () => {
  let server;

  before(async () => {
    server = chai.request(app);
    shelljs.rm('-rf', `${config.folders.resource}/*`);
  });

  it('should upload images successfully', async () => {
    const { status, body } = await server
      .post('/upload')
      .attach(
        'images',
        fs.readFileSync(`${__dirname}/SuperWoman.jpg`),
        'SuperWoman.jpg'
      )
      .query({ name: 'wonder woman' });
    // Assert
    assert.equal(status, 200);
    assert.exists(body.images, 'Return files should be exist');
    assert.isArray(body.images, 'Return array of files');
    assert.equal(
      body.images.length,
      1,
      'The number of return files should be matched'
    );

    return new Promise(resolve =>
      fs.readdir(config.folders.resource, (err, files) => {
        assert.isNotOk(err);
        assert.equal(
          files.filter(file => file[0] !== '.').length,
          1,
          'The uploaded file should be in the right place'
        );
        resolve(true);
      })
    );
  });
});
