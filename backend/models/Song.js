const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const songSchema = Schema({
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('Song', songSchema);