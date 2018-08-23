"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commands_json_1 = require("../../commands.json");
const Server_1 = require("../components/Server");
const Submission_1 = require("../components/Submission");
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
            break;
        case "$submit":
            try {
                Submission_1.default.createSubmission(message);
            }
            catch (error) {
                //message.channel.send(error)
            }
            break;
        case "$play":
            break;
        default:
            break;
    }
}
//# sourceMappingURL=CommandHandler.js.map