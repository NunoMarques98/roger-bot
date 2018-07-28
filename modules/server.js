const serverSchema = require('../models/serverSchema');
const flagTable = require('../flags.json').serverFlagTable;

const DialogChain = require('./dialogChain');
const Dailog = require('./dialog');

const questions = require('../dialogs.json').serverQuestions;

class Server {

    constructor() {


    }

    static async routeServerCommands(flags, values, serverID, message) {

        let match = flags.match(/^-(u(br?|jl|mr?|d|cr|)|i?r)$/);
        let returnMessage = '';

        if(match != null) {

            let matchedFlag = match[0];
            let query;

            if(matchedFlag == '-ir') {
                
                query = {id: serverID};

                let existance = await serverSchema.checkExistance(query);

                existance ? returnMessage = "Your ship is already registered and ready to sail!" : returnMessage = "You have no ship yet!";
            }

            else if(matchedFlag == '-r') {

                query = {id: serverID};

                let existance = await serverSchema.checkExistance(query);

                if(!existance){

                    this.joinServer(message.guild);

                    returnMessage = "Ship built!";
                } 

                else returnMessage = "You already have a ship!";
            }

            else {

                query = {id: serverID};
                let update = flagTable[matchedFlag];
                let key = Object.keys(update)[0];

                update[key] = values;

                serverSchema.changeID(query, update);

                returnMessage = "ID updated!";
            }

        }

        else returnMessage = "Invalid flag!";

        message.channel.send(returnMessage);
    }

    static joinServer(guild) {

        let dialogChain = new DialogChain(null, [], "Let's setup the ship!", "That's all Cap'n. You can always change me channels later!");

        questions.map( (question) => {

            let dialog = new Dailog(question);

            dialogChain.addDialog(dialog);
        })

        let channels = guild.channels.filter(channel => channel.type === 'text');

        let guildDefaultChannelID = channels.array()[0].id;

        dialogChain.initDialog(guild.owner, dialogAnswers => {

            serverSchema.saveServer(guild, dialogAnswers, guildDefaultChannelID)
        });
    }
}

module.exports = Server;