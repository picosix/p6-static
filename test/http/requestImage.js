const fs = require('fs');
const crypto = require('crypto');
const shelljs = require('shelljs');
const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../..');
const { folders, allowSizes, host } = require('../../src/settings');

const { assert } = chai;
chai.use(chaiHttp);

describe('Request image with size', () => {
  let server;
  let fileName;
  let size;

  before(async () => {
    //  Clear cache
    shelljs.rm('-rf', `${folders.cache}/*`);
    // Clear resource
    shelljs.rm('-rf', `${folders.resource}/*`);

    server = chai.request(app);

    const { body } = await server
      .post('/image/upload')
      .set('Origin', host)
      .attach(
        'images',
        fs.readFileSync(`${__dirname}/SuperWoman.jpg`),
        'SuperWoman.jpg'
      );
    fileName = body.images[0].name;
    [size] = Object.keys(allowSizes);
  });

  it('should return image binary will full size', async () => {
    const { status, text } = await server.get(`/image/full/${fileName}`);
    // Assert
    assert.equal(status, 200);
    return new Promise((resolve, reject) =>
      fs.readFile(`${folders.cache}/full-${fileName}`, 'utf8', (err, data) => {
        if (err) return reject(err);

        assert.equal(
          crypto
            .createHash('md5')
            .update(text)
            .digest('hex'),

          crypto
            .createHash('md5')
            .update(data)
            .digest('hex')
        );

        return resolve(true);
      })
    );
  });

  it(`should return image binary will config size`, async () => {
    const { status, text } = await server.get(`/image/${size}/${fileName}`);
    // Assert
    assert.equal(status, 200);
    return new Promise((resolve, reject) =>
      fs.readFile(
        `${folders.cache}/${size}-${fileName}`,
        'utf8',
        (err, data) => {
          if (err) return reject(err);

          assert.equal(
            crypto
              .createHash('md5')
              .update(text)
              .digest('hex'),

            crypto
              .createHash('md5')
              .update(data)
              .digest('hex')
          );

          return resolve(true);
        }
      )
    );
  });
});
