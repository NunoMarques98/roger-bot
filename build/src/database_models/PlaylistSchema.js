"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Mongo = require("mongoose");
const MAX_TRACKS = 20;
const START_TRACKS = 0;
const MusicSchema = new Mongo.Schema({
    title: String,
    link: String
});
const PlaylistSchema = new Mongo.Schema({
    userID: String,
    playlistID: Number,
    maxTracks: Number,
    currentTracks: Number,
    name: String,
    tracks: [MusicSchema]
});
const Playlist = Mongo.model("Playlist", PlaylistSchema);
function createPlaylist(userID, plID, name) {
    let playlist = new Playlist({
        userID: userID,
        playlistID: plID,
        maxTracks: MAX_TRACKS,
        currentTracks: START_TRACKS,
        name: name,
        tracks: []
    });
    playlist.save(err => { if (err)
        throw err; });
}
exports.createPlaylist = createPlaylist;
//# sourceMappingURL=PlaylistSchema.js.map