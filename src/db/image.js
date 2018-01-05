const mongoose = require('mongoose');
const _ = require('lodash');
const { allowSizes } = require('../settings');
const { generateCacheUrl } = require('../services/image');

const { Schema } = mongoose;

// Schema
const schema = new Schema({
  name: { type: Schema.Types.String, required: true },
  path: { type: Schema.Types.String, required: true },
  size: { type: Schema.Types.Number, required: true }
});

// Get all cache url of all size
schema.virtual('url').get(function getUrl() {
  return generateCacheUrl({
    name: this.name,
    sizes: _.keys(allowSizes)
  });
});

module.exports = mongoose.model('Image', schema);
