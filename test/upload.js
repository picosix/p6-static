const fs = require('fs');
const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('..');
const config = require('../src/config');

const { assert } = chai;
chai.use(chaiHttp);

describe('Upload', () => {
  let server;

  before(async () => {
    server = chai.request(app);
  });

  it('should upload images successfully', async () => {
    const { status, body } = await server
      .post('/upload')
      .attach(
        'images',
        fs.readFileSync(`${__dirname}/SuperWoman.jpg`),
        'SuperWoman.jpg'
      );
    // Assert
    assert.equal(status, 200);
    assert.exists(body.files, 'Return files should be exist');
    assert.isArray(body.files, 'Return array of files');
    assert.equal(
      body.files.length,
      1,
      'The number of return files should be matched'
    );

    fs.readdir(config.folders.resource, (err, files) => {
      assert.isNotOk(err);
      assert.equal(
        files.length,
        1,
        'The uploaded file should be in the right place'
      );
    });
  });
});
