import { commands } from "../../commands.json";
import * as Discord from "discord.js";
import { checkServerCommands } from "../components/Server";

function checkCommands(message : Discord.Message) {
    
    let parts : Array<string> = getCommandParts(message);

    let command = parts[0];
    
    if(commands.includes(command)) handleCommands(command, parts.splice(0, 1), message);

    else throw "Command not found!";
}

function getCommandParts(message: Discord.Message) : Array<string> {

    let parts = message.content.split(" ");

    return parts;
}

function handleCommands(command: string, flags: Array<string>, message: Discord.Message) {

    switch (command) {

        case "$server":
            
            checkServerCommands(flags[0], flags[1], message);

            break;

        case "$deadline":

            break;

        case "$submit":

            break;

        case "$play":

            break;

        default:
            break;
    }
}

export { checkCommands }