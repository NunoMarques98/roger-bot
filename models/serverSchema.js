const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ServerSchema = new Schema({

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

const DiscordServer = mongoose.model("server", ServerSchema);

module.exports = {

    server: DiscordServer,

    saveServer(guild, dialogAnswers, guildDefaultChannelID) {

        let serverToJoin = new DiscordServer({

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

        })

        serverToJoin.save( (err) => { if (err) throw err } );
    },

    changeID(query, channelIDUpdate) {

        DiscordServer.findOneAndUpdate(query, channelIDUpdate, (err) => {

            if (err) throw err;
        })
    },

    checkExistance(query) {

        return new Promise( (resolve, reject) => {

            DiscordServer.findOne(query, (err, data) => {

                if (err) reject(err);

                resolve(data != null);
            })
        })

    }

}