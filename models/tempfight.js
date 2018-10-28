var mongoose = require('mongoose');

var TempFight = mongoose.model('TempFight', {
   code: {
       type: String,
       required: true,
       trim: true,
   },
   ended: {
       type: Number,
       required: true,
       default: 0,
   },
   user: {
       type: String,
       required: true
   },
   target: {
       type: String,
       required: true
   },
   createdAt: {},
   expire_at: {type: Date, default: Date.now, expires: 60} 
});

module.exports = {TempFight};