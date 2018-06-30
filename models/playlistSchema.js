const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MusicSchema = new Schema({

    title: String,
    link: String

});

const PlaylistSchema = new Schema({

    userID: Number,
    playlistID: Number,
    maxTracks: Number,
    currentTracks: Number,
    name: String,
    tracks: [MusicSchema]

});

const Playlist = mongoose.model('playlist', PlaylistSchema);

module.exports = Playlist;
