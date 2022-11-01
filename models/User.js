const mongoose = require('mongoose');

module.exports = mongoose.model('User', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 255,
        unique: true
    },
    email: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        maxLength: 1024,
    },
    addedDate: {
        type: Date,
        required: true,
        default: Date.now        
    }

}, { versionKey: false }));