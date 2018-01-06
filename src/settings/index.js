const path = require('path');
const _ = require('lodash');

/* eslint no-param-reassign: 0 */
const parseAllowSizes = configString => {
  const sizes = configString.split(',').map(size => size.trim());
  return _.reduce(
    sizes,
    (result, size) => {
      let sizeValue;
      const segments = size.split(':');
      // Invalid config
      if (segments.length !== 2) return result;
      const [name, value] = segments;
      // Invalid relative size
      if (!name || !value) return result;
      if (_.isNumber(Number(value)) && !_.isNaN(Number(value))) {
        sizeValue = Number(value);
      }

      // Return relative size
      if (sizeValue) {
        result[name] = sizeValue;
        return result;
      }

      const [width, height] = value.split('-');
      // Invalid absolute size
      if (!width || !height) return result;
      if (
        _.isNumber(Number(width)) &&
        !_.isNaN(Number(width)) &&
        _.isNumber(Number(height)) &&
        !_.isNaN(Number(height))
      ) {
        sizeValue = {
          width: Number(width),
          height: Number(height)
        };
      }
      // Cannot parse size
      if (!sizeValue) return result;

      result[name] = sizeValue;
      return result;
    },
    {}
  );
};

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
    allowSizes: parseAllowSizes(process.env.EMBEDDED_ALLOW_SIZES),
    position: process.env.EMBEDDED_POSITION || 'southwest'
  },
  allowSizes: parseAllowSizes(process.env.ALLOW_SIZES),
  host: process.env.VIRTUAL_HOST,
  db: {
    connectString: `mongodb://mongo/${process.env.DB_DATABASE}`
  },
  allowHosts: [
    process.env.VIRTUAL_HOST,
    ...(process.env.CORS_DOMAIN
      ? process.env.CORS_DOMAIN.split(',').map(org => org.trim())
      : [])
  ]
};
