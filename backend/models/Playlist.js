const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playlistSchema = Schema({
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
    },
    description: {
        type: String,
    }, 
    songs: {
        type: Array
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Playlist', playlistSchema);