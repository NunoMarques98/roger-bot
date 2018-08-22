"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commands_json_1 = require("../../commands.json");
function checkCommands(message) {
    let parts = getCommandParts(message);
    let command = parts[0];
    console.log(command, parts, commands_json_1.commands);
    if (commands_json_1.commands.includes(command))
        handleCommands(command, parts.splice(0, 1));
    else
        throw "Command not found!";
}
exports.checkCommands = checkCommands;
function getCommandParts(message) {
    let parts = message.content.split(" ");
    return parts;
}
function handleCommands(command, flags) {
}
//# sourceMappingURL=CommandHandler.js.map