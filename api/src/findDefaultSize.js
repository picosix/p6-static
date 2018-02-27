const transform = require("../transform.json");
const { urlPrefix } = require("./settings");

module.exports = ({ name, domain }) => {
  let defaultSize;
  domain = !!domain ? domain : "";

  const types = Object.keys(transform);

  // Loop through transform type
  for (let i = 0; i < types.length; i++) {
    const type = types[i];

    const sizes = Object.keys(transform[type]);

    // Loop through transform size of each type
    for (let j = 0; j < sizes.length; j++) {
      const size = sizes[j];

      // Generate cache url for size of type
      const info = transform[type][size];

      if (!defaultSize && info.default) {
        defaultSize = {
          type,
          size,
          cacheUrl: `${domain}/${urlPrefix}/${type}/${size}/${name}`
        };
      }
    }
  }

  return defaultSize;
};
