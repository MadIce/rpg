const mongoose = require('mongoose');

var Message = mongoose.model('Message', {
    username: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    createdAt: {}
});

module.exports = {Message};