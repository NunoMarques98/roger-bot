import * as Mongo from "mongoose";
import * as Discord from "discord.js";

const ServerSchema : Mongo.Schema = new Mongo.Schema({

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

const Server : Mongo.Model<any> = Mongo.model("Server", ServerSchema);

function saveServer(guild : Discord.Guild, dialogAnswers : any, guildDefaultChannelID : string) : void {
    
    let server : Mongo.Document = new Server({

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

    server.save( err => { if(err) throw err });
}

function changeID(query : Object, channelIDUpdate: string) : void {

    Server.findOneAndUpdate(query, channelIDUpdate, err => {

        if (err) throw err;
    })
}

function checkExistance(query : Object) : Promise <any> {

    return new Promise( (resolve, reject) => {

        Server.findOne(query, (err, data) => {

            if (err) reject(err)

            resolve(!!data);
        })
    })
}

export {saveServer, changeID, checkExistance};