const prefix = require('../settings.json').prefix;
const Server = require('../models/server');
const Submission = require('./submissions');
const DeadLine = require('./deadLine');

class Message {

    constructor(guildID, memberID, channel, content, alias, attachment, guild) {

        this.guildID = guildID;
        this.guild = guild
        this.memberID = memberID;
        this.channel = channel;
        this.content = content;
        this.alias = alias;
        this.attachment = attachment;
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

                case "$submit":

                    result = Submission.routeSubmission(message);

                    break;
            
                default:

                    message.channel.send("Command not found!");
                    break;
            }


        }
    }

}

module.exports = Message;