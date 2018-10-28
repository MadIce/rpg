var mongoose = require('mongoose');

var Revive = mongoose.model('Revive', {
   username: {
       type: String,
       required: true
   },
   count: {
       type: Number,
       default: 0,
       max: 4
   },
   expire_at: {type: Date, default: Date.now, expires: 3600}
});

module.exports = {Revive};
