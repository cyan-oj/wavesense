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
    },
    playlistId: {
        type: Schema.Types.ObjectId,
        ref: 'Playlist'
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('Song', songSchema);