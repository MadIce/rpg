var mongoose = require('mongoose');

var Revive = mongoose.model('Revive', {
   username: {
       type: String,
       required: true
   },
   count: {
       type: Number,
       default: 0,
       max: 3
   },
  expire_at : { type : Date, expires : '60m', default: Date.now } 


});

module.exports = {Revive};
