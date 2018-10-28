const mongoose = require('mongoose');

var Session = mongoose.model('Session', {
    session: {

    },
    expires: {

    }
});

module.exports = {Session};