const mongoose = require('mongoose');

var Fight = mongoose.model('Fight', {
    username: {
        type: String,
        required: true
    },
    enemyname: {
        type: String,
        required: true
    },
    gold: {
        type: Number,
        required: true,
        min: 0
    },
    exp: {
        type: Number,
        min: 0,
        required: true
    },
    ended: {
        type: Number,
        default: 0,
        required: true
    },
    createdAt: {}
});

module.exports = {Fight};