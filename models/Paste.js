const mongoose = require('mongoose');

module.exports = mongoose.model('Paste', new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    paste: {
        type: String,
        required: true
    },
    syntax: {
        type: String,
        required: true,
        default: "None"
    },
    addedDate: {
        type: Date,
        required: true,
        default: Date.now
    }
}, { versionKey: false }));