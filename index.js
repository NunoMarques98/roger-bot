const Discord = require('discord.js');
const client = new Discord.Client();

client.login('');

client.on('message', message => {


  console.log(message.attachments);
});

