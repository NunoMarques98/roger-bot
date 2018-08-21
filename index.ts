import {token, prefix, dbLink} from "./settings.json";

import * as Discord from "discord.js";
import * as Mongo  from "mongoose";

const client : Discord.Client = new Discord.Client();

client.login(token);

Mongo.connect(dbLink).then(() => {

    console.log("Connected...");
})
.catch( (err) => {

    console.log(err);
})

client.on('guildMemberAdd', member => {

    
})

client.on('guildCreate', guild => {


})

client.on('message', message => {

    if(message.content.startsWith(prefix)) {

        let attachment : Discord.MessageAttachment = message.attachments.first();

        
    }
})