const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MAX_TRACKS = 20;
const START_TRACKS = 0;

const MusicSchema = new Schema({

    title: String,
    link: String

});

const PlaylistSchema = new Schema({

    userID: String,
    playlistID: Number,
    maxTracks: Number,
    currentTracks: Number,
    name: String,
    tracks: [MusicSchema]

});

const Playlist = mongoose.model("playlist", PlaylistSchema);

module.exports = { 
    
    playlist: Playlist,

    createPlaylist: (userID, plID, name) => {

        let playlistToCreate = new Playlist({

            userID: userID,
            playlistID: plID,
            maxTracks: MAX_TRACKS,
            currentTracks: START_TRACKS,
            name: name,
            tracks: []

        })

        playlistToCreate.save( (err) => { if (err) throw err });
    }

};
