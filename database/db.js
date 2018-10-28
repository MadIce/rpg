const mongoose = require('mongoose');
mongoose.connect('mongodb://mysteryofdungeons:theory11@ds223253.mlab.com:23253/mysteryofdungeons');

module.exports = {mongoose};