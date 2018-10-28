const mongoose = require('mongoose');

var BoughtItem = mongoose.model('BoughtItem', {
    item_id: {
        type: String,
        required: true
    },
    item_title: {
        type: String,
        required: true
    },
    item_power: {
        type: Number,
        require: true
    },
    item_description: {
        type: String,
    },
    item_price: {
        type: Number,
        required: true
    },
    item_img: {
        type: String,
        required: true
    },
    item_type: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    createdAt: {
    }
});

module.exports = {BoughtItem};