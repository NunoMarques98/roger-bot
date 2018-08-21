import * as Mongo from "mongoose";

const MAX_TRACKS : number = 20;
const START_TRACKS : number = 0;

const MusicSchema : Mongo.Schema = new Mongo.Schema({

    title: String,
    link: String
});

const PlaylistSchema : Mongo.Schema = new Mongo.Schema({

    userID: String,
    playlistID: Number,
    maxTracks: Number,
    currentTracks: Number,
    name: String,
    tracks: [MusicSchema]

})

const Playlist : Mongo.Model<any> = Mongo.model("Playlist", PlaylistSchema);

function createPlaylist(userID : string, plID: string, name : string) : void {
    
    let playlist : Mongo.Document = new Playlist({

        userID: userID,
        playlistID: plID,
        maxTracks: MAX_TRACKS,
        currentTracks: START_TRACKS,
        name: name,
        tracks: []

    })

    playlist.save( err => { if (err) throw err });
}

export { createPlaylist }