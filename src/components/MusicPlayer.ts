import * as ytdl from "ytdl-core";
import { StreamDispatcher, VoiceChannel, Message, VoiceConnection } from "discord.js";

const youtubeRegex : RegExp = /^https?:\/\/(www.youtube.com|youtube.com)/;

let dispatcher : StreamDispatcher;
let voiceChannel : VoiceChannel;
let queue : Array<string> = [];

function enqueue(message : Message) : void {

    let url : string = message.content.slice(6);

    url = url.replace("'", '"');

    if(youtubeRegex.test(url)) queue.push(url);
}

function selector(voiceChannel : VoiceChannel) : void {

    voiceChannel = voiceChannel;

    voiceChannel.join().then( connection => {

        play(connection);

        dispatcher.on("end", () => {

            next();
        })
    })
}

function play(connection : VoiceConnection) : void {

    let music : any = ytdl(queue[0], { filter: (format) => format.container === 'mp4' });

    dispatcher = connection.playStream(music);
}

function playing() : string {

    return queue[0];
}

function handler(message : Message) : void {

    voiceChannel = message.member.voiceChannel;

    if(queue.length === 0){

        enqueue(message);
        selector(voiceChannel);

    } else {

        enqueue(message);
        
    }
}

function skip(){

    dispatcher.end();

}

function next(){

    queue.shift();

    if(queue.length === 0){

        voiceChannel.leave();
    }

    else {

        selector(voiceChannel);

    }
}

export { handler };