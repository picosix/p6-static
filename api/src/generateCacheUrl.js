const transform = require("../transform.json");

module.exports = ({ name, domain, reutrnCachePath = false }) => {
  let cacheUrls = {};
  let cachePaths = [];
  domain = !!domain ? domain : "";

  const types = Object.keys(transform);

  // Loop through transform type
  for (let i = 0; i < types.length; i++) {
    const type = types[i];

    if (!cacheUrls[type]) cacheUrls[type] = {};

    const sizes = Object.keys(transform[type]);

    // Loop through transform size of each type
    for (let j = 0; j < sizes.length; j++) {
      const size = sizes[j];

      // Generate cache url for size of type
      const info = transform[type][size];
      cacheUrls[type][size] = `${domain}/${type}/${size}/${name}`;

      cachePaths.push(`${type}-${size}-${name}`);
    }
  }

  return reutrnCachePath ? cachePaths : cacheUrls;
};
