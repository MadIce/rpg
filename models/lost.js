const mongoose = require('mongoose');

var LostFight = mongoose.model('LostFight', {
    username: {
        type: String,
        required: true
    },
    enemyname: {
        type: String,
        required: true
    },
    createdAt: {}
});

module.exports = {LostFight};