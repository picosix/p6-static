const mongoose = require('mongoose');
const bluebird = require('bluebird');
const { db } = require('../settings');

// Mongoose config
mongoose.connect(db.connectString);
mongoose.Promise = bluebird;

const Image = require('./image');

module.exports = { Image };
