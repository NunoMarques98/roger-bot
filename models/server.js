const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DialogChain = require('../modules/dialogChain');
const Dailog = require('../modules/dialog');

const flagTable = require('../settings.json').flagTable;

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

    joinServer(guild) {

        let questions = ["Bot channel ID?", "Music channel ID?", "Join/Leave Channel ID?", "Role name for music interactions?", "Role name for util functions?", "Role name for advanced configs?"];

        let dialogChain = new DialogChain(null, [], "Let's setup the ship!", "That's all Cap'n. You can always change me channels later!");

        questions.map( (question) => {

            let dialog = new Dailog(question);

            dialogChain.addDialog(dialog);
        })

        let channels = guild.channels.filter(channel => channel.type === 'text');
        
        dialogChain.initDialog(guild.owner, (cb) => {

            let guildDefaultChannelID = channels.array()[0].id;

            let serverToJoin = new DiscordServer({

                name: guild.name,
                id: guild.id,
                ownerID: guild.ownerID,
                region: guild.region,
                defaultChannelID: guildDefaultChannelID,
                botChannelID: cb[0].answer || guildDefaultChannelID,
                musicChannelID: cb[1].answer || guildDefaultChannelID,
                joinLeaveChannelID: cb[2].answer || guildDefaultChannelID,
                musicRoleName: cb[3].answer,
                botRoleName: cb[4].answer,
                configRoleName: cb[5].answer
    
            })

            serverToJoin.save( (err) => { if (err) throw err });
        });
    },

    routeServerCommands(flags, values, serverID) {

        let match = flags.match(/^-(br?|jl|mr?|d|cr)$/);

        if(match != null) {

            let matchedFlag = match[0];
            
            let query = {id: serverID};
            let update = flagTable[matchedFlag];
            let key = Object.keys(update)[0];

            update[key] = values;

            this.changeChannelID(query, update);

            return true;
        }

        else return false;
    },

    changeChannelID(query, channelIDUpdate) {

        DiscordServer.findOneAndUpdate(query, channelIDUpdate, (err) => {

            if (err) throw err;
        })
    }

}