"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServerSchema_1 = require("../database_models/ServerSchema");
const flags_json_1 = require("../../flags.json");
const regex = /^-(u(br?|jl|mr?|d|cr|)|i?r)$/;
function checkServerCommands(flag, value, message) {
    let match = getMatch(flag);
    if (match && checkPermissions(message)) {
        try {
            routeCommands(flag, value, message);
        }
        catch (error) {
            message.channel.send(error);
        }
    }
    else if (!match)
        throw "Not a valid flag!";
    else
        throw checkPermissions(message);
}
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
}
async function isServerRegistered(message) {
    let query = { id: message.guild.id };
    let response;
    let existance = await ServerSchema_1.checkExistance(query);
    existance ? response = "Your ship is already registered and ready to sail!" : returnMessage = "You have no ship yet!";
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
//# sourceMappingURL=Server.js.map