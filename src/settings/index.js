const path = require('path');

module.exports = {
  debug: process.env.NODE_ENV !== 'production',
  folders: {
    resource: path.resolve(
      __dirname,
      '../..',
      process.env.FOLDER_RESOURCE || 'resource'
    ),
    cache: path.resolve(
      __dirname,
      '../..',
      process.env.FOLDER_CACHE || 'cache'
    ),
    static: path.resolve(
      __dirname,
      '../..',
      process.env.FOLDER_STATIC || 'static'
    )
  },
  allowTypes: process.env.ALLOW_TYPES.split(',').map(
    type => (typeof type === 'string' ? type.trim() : type)
  ),
  upload: {
    fields: Number(process.env.MAX_FIELD) || 17,
    files: Number(process.env.MAX_FILE) || 17,
    fileSize: Number(process.env.MAX_SIZE || 100) * 1048576,
    parts: Number(process.env.MAX_PART) || 17
  },
  embedded: {
    src: process.env.EMBEDDED_FILE,
    allowSizes: {
      xs: 0.2,
      sm: 0.4,
      md: 0.6,
      lg: 0.8,
      full: 1,
      '70x70': { width: 10, height: 10 }
    },
    position: process.env.EMBEDDED_POSITION || 'southwest'
  },
  allowSizes: {
    // You can use percent
    xs: 0.2,
    sm: 0.4,
    md: 0.6,
    lg: 0.8,
    full: 1,
    // Or absolute size
    '70x70': { width: 70, height: 70 }
  }
};
