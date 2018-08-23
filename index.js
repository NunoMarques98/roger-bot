const {token, prefix, dbLink, containerLink} = require("./settings.json");

const Discord = require('discord.js');
const client = new Discord.Client();
const mongo = require('mongoose');

const Message = require('./modules/message');
/*mongo.connect(process.env.DB).catch( (err) => {

    console.log(err);
})*/

mongo.connect(dbLink, {
    autoReconnect: true,
    reconnectTries: 60,
    reconnectInterval: 1000

}).then(() => {

    console.log("Connection establised...");

}).catch( (err) => {

    console.log(err);
}) 

//client.login(process.env.BOT_TOKEN);
client.login(token);

client.on('guildMemberAdd', member => {

    user.createUser(member.displayName, member.id, (cb) => {

        let channel = client.channels.get("460934242713600013");

        channel.send(cb).then( console.log(cb) ).catch( console.error );
    })
})

client.on('guildCreate', guild => {

    Server.joinServer(guild);
})

client.on('message', message => {

    if(message.content.startsWith(prefix)) {

        let attachment = null;

        if(message.attachments) attachment = message.attachments.first();

        let messageReceived = new Message(message.guild.id, message.member.id, message.channel, message.content, message.author.username, attachment, message.guild);

        Message.routeMessage(messageReceived, message);
    }
})