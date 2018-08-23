"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServerSchema_1 = require("../database_models/ServerSchema");
const flags_json_1 = require("../../flags.json");
const Dialog_1 = require("./Dialog");
const DialogChain_1 = require("./DialogChain");
const dialogs_json_1 = require("../../dialogs.json");
const regex = /^-(u(br?|jl|mr?|d|cr|)|i?r)$/;
function checkServerCommands(flag, value, message) {
    let match = getMatch(flag);
    if (match) {
        try {
            routeCommands(flag, value, message);
        }
        catch (error) {
            //message.channel.send(error);
        }
    }
    else if (!match)
        throw "Not a valid flag!";
    else
        throw "Not defined!";
}
exports.checkServerCommands = checkServerCommands;
function getMatch(flag) {
    let match = flag.match(regex);
    return match[0];
}
function routeCommands(flag, value, message) {
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
function checkPermissions(message) {
    return true;
}
async function isServerRegistered(message) {
    let query = { id: message.guild.id };
    let response;
    let existance = await ServerSchema_1.checkExistance(query);
    existance ? response = "Your ship is already registered and ready to sail!" : response = "You have no ship yet!";
    message.channel.send(response);
}
async function registerServer(message) {
    let query = { id: message.guild.id };
    let response = "You already have a ship!";
    let existance = await ServerSchema_1.checkExistance(query);
    if (!existance) {
        joinServer(message.guild);
        response = "Ship built!";
    }
    message.channel.send(response);
}
function updateField(flag, value, message) {
    let query = { id: message.guild.id };
    let update = flags_json_1.serverFlagTable[flag];
    let key = Object.keys(update)[0];
    update[key] = value;
    ServerSchema_1.changeID(query, update);
    message.channel.send("ID updated!");
}
function joinServer(guild) {
    let dialogs = dialogs_json_1.serverDialog.map(question => {
        let dialog = new Dialog_1.default(question);
        return dialog;
    });
    let dialogChain = new DialogChain_1.default(dialogs, "Let's setup the ship!", "That's all Cap'n. You can always change the ship later!");
    let channels = guild.channels.filter(channel => channel.type === "text");
    let guildDefaultChannelID = channels.array()[0].id;
    dialogChain.initDialog(guild.owner).then(dialogAnswers => {
        ServerSchema_1.saveServer(guild, dialogAnswers, guildDefaultChannelID);
    });
}
exports.joinServer = joinServer;
//# sourceMappingURL=Server.js.map