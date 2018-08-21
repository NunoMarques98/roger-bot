"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Mongo = require("mongoose");
const START_GOLD = 0;
const START_PLAYLIST = 0;
const MAX_PLAYLIST = 5;
const START_LEVEL = 1;
const START_EXP = 0;
const START_RANK = "Powder Monkey";
const FACTOR = 5;
const UserSchema = new Mongo.Schema({
    name: String,
    userID: String,
    numPlaylists: Number,
    maxPlaylists: Number,
    level: Number,
    currExp: Number,
    expToLevelUp: Number,
    rank: String,
    gold: Number
});
const User = Mongo.model("User", UserSchema);
exports.User = User;
function nextExp(level) {
    let expNeeded = FACTOR * (level + 1) * Math.log10(level + 1);
    return Math.floor(expNeeded);
}
function checkExistance(id) {
    return new Promise((resolve, reject) => {
        User.findOne({ userID: id }).then(data => {
            resolve(!!data);
        });
    });
}
function createUser(name, id) {
    return new Promise(async (resolve, reject) => {
        let exists = await checkExistance(id);
        if (exists)
            resolve(":bomb: Welcome back lad. We are short on people to feed the Kraken! :octopus:");
        else {
            let user = new User({
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
            user.save((err) => { if (err)
                throw err; });
            resolve(":sailboat: Welcome aboard sailor! Settle in with the crew and have some rum lad! :champagne:");
        }
    });
}
exports.createUser = createUser;
//# sourceMappingURL=UserSchema.js.map