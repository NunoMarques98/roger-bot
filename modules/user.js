const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const START_GOLD = 0;
const START_PLAYLIST = 0;
const MAX_PLAYLIST = 5;
const START_LEVEL = 1;
const START_EXP = 0;
const START_RANK = "";

const FACTOR = 5;

const UserSchema = new Schema({

    name: String,
    userID: Number,
    numPlaylists: Number,
    maxPlaylists: Number,
    level: Number,
    currExp: Number,
    expToLevelUp: Number,
    rank: String,
    gold: Number

});

const User = mongoose.model("user", UserSchema);

function nextExp(level) {
    
    let expNeeded = FACTOR*(level + 1)*Math.log10(level + 1);

    return Math.floor(expNeeded);
}

module.exports = {

    user: User,

    createUser: (name, id, callback) => {

        let userToCreate = new User({

            name: name,
            userID: id,
            numPlaylists: START_PLAYLIST,
            maxPlaylists: MAX_PLAYLIST,
            level: START_LEVEL,
            currExp: START_EXP,
            expToLevelUp: nextExp(START_LEVEL),
            rank: START_RANK,
            gold: START_GOLD

        });

        userToCreate.save( (err) => { if(err) throw err })
    },


}