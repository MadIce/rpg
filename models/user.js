const mongoose = require('mongoose');

var User = mongoose.model('User', {
    username: {
        type: String,
        minlength: 3,
        maxlength: 12,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        minlength: 6,
        trim: true,
        required: true
    },
    type: {
        required: true,
        type: String
    },
    strength: {
        type: Number,
        min: 1,
        max: 100
    },
    dexterity: {
        type: Number,
        min: 1,
        max: 100
    },
    vitality: {
        type: Number,
        min: 1,
        max: 100
    },
    intellect: {
        type: Number,
        min: 1,
        max: 100
    },
    items_dexterity: {
        type: Number,
        min: 0,
        max: 100
    },
    items_strength: {
        type: Number,
        min: 0,
        max: 100
    },
    items_vitality: {
        type: Number,
        min: 0,
        max: 100
    },
    items_intellect: {
        type: Number,
        min: 0,
        max: 100
    },
    gold: {
        type: Number,
        default: 150,
        min: 0
    },
    upgradePoints: {
        type: Number,
        default: 10,
        min: 0
    },
    level: {
        type: Number,
        default: 1,
        min: 1,
        max: 100
    },
    health: {
        type: Number,
        default: 100,
        min: 0,
        max: 100
    },
    exp: {
        type: Number,
        default: 0
    },
    current_exp: {
        type: Number,
        default: 0        
    },
    fights_win: {
        type: Number,
        default: 0,
        min: 0
    },
    fights_lost: {
        type: Number,
        default: 0,
        min: 0
    },
    createdAt: {
        type: String
    },
    last_login: {
        type: String
    },
    skin: {
        required: true,
        type: String
    },
    first_login: {
        type: Number,
        default: 0
    }
});


module.exports = {User};