const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DialogChain = require('../modules/dialogChain');
const Dailog = require('../modules/dialog');

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

    joinServer(guild) {

        let owner = guild.owner;

        let questions = ["Bot channel ID?", "Music channel ID?", "Join/Leave Channel ID?"];

        let dialogs = [];

        questions.map( (question) => {

            let dialog = new Dailog(question);

            dialogs.push(dialog);
        })

            
        let dialogChain = new DialogChain(null, dialogs);
        
        dialogChain.initDialog(owner, (cb) => {

            for(let i = 0; i < dialogChain.dialogs.length; i++) {

                console.log(dialogChain.dialogs[i].answer);
            }

        });

        //channel.delete();

        

        /*let serverToJoin = new DiscordServer({

            name: guild.name,
            id: guild.id,
            ownerID: guild.ownerID,
            region: guild.region,
            defaultChannelID: guild.defaultChannel.id,
            botChannelID: guild.defaultChannel.id,
            musicChannelID: guild.defaultChannel.id,
            joinLeaveChannelID: guild.defaultChannel.id

        })

        serverToJoin.save( (err) => { if (err) throw err });*/
        
    }

}