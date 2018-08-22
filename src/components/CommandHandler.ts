import { commands } from "../../commands.json";
import * as Discord from "discord.js";

function checkCommands(message : Discord.Message) {
    
    let parts : Array<string> = getCommandParts(message);

    let command = parts[0];
    
    if(commands.includes(command)) handleCommands(command, parts.splice(0, 1));

    else throw "Command not found!";
}

function getCommandParts(message: Discord.Message) : Array<string> {

    let parts = message.content.split(" ");

    return parts;
}

function handleCommands(command: string, flags: Array<string>) {

    switch (command) {

        case "$server":
            
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