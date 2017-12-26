const app = require('..');
const config = require('../src/config');
const { createFolder } = require('../src/utils');

createFolder(config).then(() => {
  const port = process.env.PORT || 9999;
  app.listen(port);
});
