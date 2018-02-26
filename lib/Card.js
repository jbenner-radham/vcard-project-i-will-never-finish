'use strict';

const mongoose = require('mongoose');

module.exports = mongoose.model('Card', new mongoose.Schema({
    type: {type: String, default: 'card'},
    name: String,
    nickname: {type: String, index: true},
    url: String
}));
