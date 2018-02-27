'use strict';

const mongoose = require('mongoose');

module.exports = mongoose.model('Card', new mongoose.Schema({
    _resourceId: {type: String, required: true, index: true},
    type: {type: String, default: 'card'},
    name: String,
    nickname: String,
    email: String,
    url: String
}));
