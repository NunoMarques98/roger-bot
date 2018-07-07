const prefix = require('../settings.json').prefix;
const Server = require('../models/server');

class Message {

    constructor(guildID, memberID, channel, content) {

        this.guildID = guildID;
        this.memberID = memberID;
        this.channel = channel;
        this.content = content;
    }

    static routeMessage(message) {

        if(message.content.startsWith(prefix)) {

            let commandParts = message.content.split(" ");

            let command = commandParts[0];

            switch (command) {

                case "$updateID":

                    let flag = commandParts[1];
                    let value = commandParts[2];

                    let result = Server.routeServerCommands(flag, value, message.guildID);

                    if (result) message.channel.send("ID updated!");

                    else message.channel.send("Invalid flag!");

                    break;
            
                default:

                    message.channel.send("Command not found!");
                    break;
            }


        }
    }

}

module.exports = Message;