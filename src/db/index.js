const mongoose = require('mongoose');
const bluebird = require('bluebird');

// Mongoose config
mongoose.connect(`mongodb://mongo/${process.env.DB_DATABASE}`);
mongoose.Promise = bluebird;

const Image = require('./image');

module.exports = { Image };
