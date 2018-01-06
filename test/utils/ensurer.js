const path = require('path');
const fs = require('fs');
const chai = require('chai');
const shell = require('shelljs');
const { folderMaker } = require('../../src/utils/ensurer');

const { assert } = chai;

describe('Generate cache url', () => {
  const testFolder = path.resolve(__dirname, '../..', 'public/testFolder');

  it('should create folder if it is not eixst', async () => {
    const folderPath = await folderMaker([testFolder]);

    assert.isArray(folderPath);
    assert.exists(folderPath[0]);
    assert.isOk(fs.existsSync(folderPath[0]));
  });

  after(async () => {
    shell.rm('-rf', `${testFolder}`);
  });
});
