import { commands } from "../../commands.json";

import * as Discord from "discord.js";

import { checkServerCommands } from "../components/Server";
import { handler } from "../components/MusicPlayer";
import Submission from "../components/Submission";
import DeadLine from "../components/DeadLine";

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

            DeadLine.routeDeadLineCommands(flags[0], message);
            break;

        case "$submit":

            Submission.createSubmission(message);
            break;

        case "$play":
        
            handler(message);
            break;

        default:
            break;
    }
}

export { checkCommands }