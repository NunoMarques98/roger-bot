"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commands_json_1 = require("../../commands.json");
const Server_1 = require("../components/Server");
const MusicPlayer_1 = require("../components/MusicPlayer");
const Submission_1 = require("../components/Submission");
const DeadLine_1 = require("../components/DeadLine");
function checkCommands(message) {
    let parts = getCommandParts(message);
    let command = parts[0];
    if (commands_json_1.commands.includes(command))
        handleCommands(command, parts.splice(0, 1), message);
    else
        throw "Command not found!";
}
exports.checkCommands = checkCommands;
function getCommandParts(message) {
    let parts = message.content.split(" ");
    return parts;
}
function handleCommands(command, flags, message) {
    switch (command) {
        case "$server":
            Server_1.checkServerCommands(flags[0], flags[1], message);
            break;
        case "$deadline":
            DeadLine_1.default.routeDeadLineCommands(flags[0], message);
            break;
        case "$submit":
            Submission_1.default.createSubmission(message);
            break;
        case "$play":
            MusicPlayer_1.handler(message);
            break;
        default:
            break;
    }
}
//# sourceMappingURL=CommandHandler.js.map