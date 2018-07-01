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
    joinLeaveChannelID: String

});

const DiscordServer = mongoose.model("server", ServerSchema);

module.exports = {

    server: DiscordServer,

    joinServer: (guild, callback) => {

        let owner = guild.owner;

        owner.createDM().then( (channel) => {

            const collector = channel.createMessageCollector(m => m.content != undefined);

            collector.on('collect', (m) => {


            })

            channel.delete();

        })


        let serverToJoin = new DiscordServer({

            name: guild.name,
            id: guild.id,
            ownerID: guild.ownerID,
            region: guild.region,
            defaultChannelID: guild.defaultChannel.id,
            botChannelID: guild.defaultChannel.id,
            musicChannelID: guild.defaultChannel.id,
            joinLeaveChannelID: guild.defaultChannel.id

        })

        serverToJoin.save( (err) => { if (err) throw err });
    }

}