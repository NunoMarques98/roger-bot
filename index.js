const Discord = require('discord.js');
const client = new Discord.Client();
const download = require('download-file')
 
client.login(process.env.BOT_TOKEN);


client.on('message', message => {

    message.reply("hello");

    /*if(message.attachments)
    {
        let messageAttachment = message.attachments.array()[0];

        let url = messageAttachment.url;
        
        let options = {

            directory: "C:/Users/nuno1/Desktop",
            filename: messageAttachment.filename

        }
        
        download(url, options, (err) => {

            if (err) throw err

            console.log("meow")

        })
    }*/
     
});

