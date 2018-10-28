const mongoose = require('mongoose');

var Item = mongoose.model('Item', {
    title: {
        required: true,
        type: String,
        trim: true
    },
    type: {
        required: true,
        type: String
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    power: {
        type: Number,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: String,
        required: true
    }
});

module.exports = {Item};