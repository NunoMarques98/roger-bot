"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Mongo = require("mongoose");
const ServerSchema = new Mongo.Schema({
    name: String,
    id: String,
    ownerID: String,
    region: String,
    defaultChannelID: String,
    botChannelID: String,
    musicChannelID: String,
    joinLeaveChannelID: String,
    musicRoleName: String,
    botRoleName: String,
    configRoleName: String
});
const Server = Mongo.model("Server", ServerSchema);
function saveServer(guild, dialogAnswers, guildDefaultChannelID) {
    let server = new Server({
        name: guild.name,
        id: guild.id,
        ownerID: guild.ownerID,
        region: guild.region,
        defaultChannelID: guildDefaultChannelID,
        botChannelID: dialogAnswers[0].answer || guildDefaultChannelID,
        musicChannelID: dialogAnswers[1].answer || guildDefaultChannelID,
        joinLeaveChannelID: dialogAnswers[2].answer || guildDefaultChannelID,
        musicRoleName: dialogAnswers[3].answer,
        botRoleName: dialogAnswers[4].answer,
        configRoleName: dialogAnswers[5].answer
    });
    server.save(err => { if (err)
        throw err; });
}
exports.saveServer = saveServer;
function changeID(query, channelIDUpdate) {
    Server.findOneAndUpdate(query, channelIDUpdate, err => {
        if (err)
            throw err;
    });
}
exports.changeID = changeID;
function checkExistance(query) {
    return new Promise((resolve, reject) => {
        Server.findOne(query, (err, data) => {
            if (err)
                reject(err);
            resolve(!!data);
        });
    });
}
exports.checkExistance = checkExistance;
//# sourceMappingURL=ServerSchema.js.map