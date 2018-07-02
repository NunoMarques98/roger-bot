const {token, prefix, dbLink} = require("./settings.json");

const Discord = require('discord.js');
const client = new Discord.Client();
const download = require('download-file');
const mongo = require('mongoose');

const user = require('./models/user');
const server = require('./models/server');

/*mongo.connect(process.env.DB).catch( (err) => {

    console.log(err);
})*/

mongo.connect(dbLink).catch( (err) => {

    console.log(err);
})

mongo.connection.once('open', () => {
    
    console.log("Connection establised...");

}).on('error', (err) => {

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

    server.joinServer(guild);
})

/*client.on('message', message => {


    if(!message.author.bot)
        message.reply("hello");

    if(message.attachments.size != 0)
    {
        let messageAttachment = message.attachments.array()[0];

        let url = messageAttachment.url;
        
        let options = {

            directory: "C:/Users/nuno1/Desktop",
            filename: messageAttachment.filename

        }
        
        download(url, options, (err) => {

            if (err) throw err
        })
    }
     
});*/

