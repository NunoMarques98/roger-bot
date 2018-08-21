import {token, prefix, dbLink} from "./settings.json";

import * as Discord from "discord.js";
import * as Mongo  from "mongoose";

import { createUser } from "./src/database_models/UserSchema";

const client : Discord.Client = new Discord.Client();

client.login(token);

Mongo.connect(dbLink).then(() => {

    console.log("Connected...");
})
.catch( (err) => {

    console.log(err);
})

client.on('guildMemberAdd', member => {

    let channel : Discord.TextChannel = <Discord.TextChannel> client.channels.get("460934242713600013");

    createUser(member.displayName, member.id).then( res => {

        channel.send(res);
    })
})

client.on('guildCreate', guild => {


})

client.on('message', message => {

    if(message.content.startsWith(prefix)) {

        let attachment : Discord.MessageAttachment = message.attachments.first();

    }
})