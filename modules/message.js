const prefix = require('../settings.json').prefix;
const Server = require('../models/server');
const DeadLine = require('../models/deadLineSchema');

class Message {

    constructor(guildID, memberID, channel, content, alias) {

        this.guildID = guildID;
        this.memberID = memberID;
        this.channel = channel;
        this.content = content;
        this.alias = alias;
    }

    static routeMessage(message) {

        if(message.content.startsWith(prefix)) {

            let commandParts = message.content.split(" ");

            let command = commandParts[0];
            let flag = commandParts[1];
            let result;

            switch (command) {

                case "$updateID":

                    let value = commandParts[2];

                    result = Server.routeServerCommands(flag, value, message.guildID);

                    if (result) message.channel.send("ID updated!");

                    else message.channel.send("Invalid flag!");

                    break;

                case "$deadline":

                    result = DeadLine.routeDeadLineCommands(flag, message);

                    if(result.msg) message.channel.send(result.msg);

                    break;
            
                default:

                    message.channel.send("Command not found!");
                    break;
            }


        }
    }

}

module.exports = Message;