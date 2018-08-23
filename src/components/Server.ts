import { saveServer, changeID, checkExistance } from "../database_models/ServerSchema";
import { serverFlagTable } from "../../flags.json";

import { Message, Guild, TextChannel, Collection, GuildChannel } from "discord.js";

import Dialog from "./Dialog";
import DialogChain from "./DialogChain";

import { serverDialog } from "../../dialogs.json";

const regex : RegExp = /^-(u(br?|jl|mr?|d|cr|)|i?r)$/;

function checkServerCommands(flag : string, value : string, message : Message) {

    let match : string = getMatch(flag);

    if(match) {

        try {
            
            routeCommands(flag, value, message)

        } catch (error) {
            
            message.channel.send(error);
        }
    }

    else if(!match) throw "Not a valid flag!";

    else throw "Not defined!";

}

function getMatch(flag : String) : string {
    
    let match = flag.match(regex);

    return match[0];
}

function routeCommands(flag : string, value : string, message : Message) {
    
    switch (flag) {

        case '-ir':
            
            isServerRegistered(message);

            break;

        case '-r':
            
            registerServer(message);

            break;
    
        default:

            updateField(flag, value, message);

            break;
    }
}

function checkPermissions(message : Message) {
    
    return true;
}

async function isServerRegistered(message : Message) {

    let query : Object = {id: message.guild.id};

    let response : string;

    let existance : boolean = await checkExistance(query);

    existance ? response = "Your ship is already registered and ready to sail!" : response = "You have no ship yet!";
    
    message.channel.send(response);
}

async function registerServer(message : Message) {

    let query : Object = {id: message.guild.id};

    let response : string = "You already have a ship!";

    let existance : boolean = await checkExistance(query);

    if(!existance) {

        joinServer(message.guild);

        response = "Ship built!";
    }

    message.channel.send(response);
}

function updateField(flag : string, value : string, message : Message) {

    let query : Object = {id: message.guild.id};

    let update = (<any> serverFlagTable)[flag];

    let key = Object.keys(update)[0];

    update[key] = value;

    changeID(query, update);

    message.channel.send("ID updated!");
}

function joinServer(guild : Guild) {

    let dialogs : Array<Dialog> = serverDialog.map( question => {

        let dialog : Dialog = new Dialog(question);

        return dialog;
    })

    let dialogChain : DialogChain = new DialogChain(dialogs, "Let's setup the ship!", "That's all Cap'n. You can always change the ship later!");

    let channels : Collection<string, GuildChannel> = guild.channels.filter(channel => channel.type === "text");

    let guildDefaultChannelID : string = channels.array()[0].id;

    dialogChain.initDialog(guild.owner).then(dialogAnswers => {

        saveServer(guild, dialogAnswers, guildDefaultChannelID)
    })
    
}

export { checkServerCommands, joinServer }