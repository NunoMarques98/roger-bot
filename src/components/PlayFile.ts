import * as ytdl from "ytdl-core";
import { StreamDispatcher, VoiceChannel, Message, VoiceConnection } from "discord.js";
import { connection, Connection } from "mongoose";

const youtubeRegex : RegExp = /^https?:\/\/(www.youtube.com|youtube.com)/;

export default class Playfile {

    dispatcher : StreamDispatcher;
    voiceChannel : VoiceChannel;
    queue : Array<string>;

    constructor() {
        
    }

    enqueue(message : Message) : void {

        let url : string = message.content.slice(6);

        url = url.replace("'", '"');

        if(youtubeRegex.test(url)) this.queue.push(url);
    }

    selector(voiceChannel : VoiceChannel) : void {

        this.voiceChannel = voiceChannel;

        voiceChannel.join().then( connection => {

            this.play(connection);

            this.dispatcher.on("end", () => {

                this.next();
            })
        })
    }

    play(connection : VoiceConnection) : void {

        let music : any = ytdl(this.queue[0], { filter: (format) => format.container === 'mp4' });

        this.dispatcher = connection.playStream(music);
    }

    playing() : string {
    
        return this.queue[0];
    }

    handler(message : Message) : void {
    
        this.voiceChannel = message.member.voiceChannel;
    
        if(this.queue.length === 0){
    
          this.enqueue(message);
          this.selector(this.voiceChannel);
    
        } else {
    
          this.enqueue(message);
          
        }
    }

    skip(){
    
        this.dispatcher.end();
    
    }

    next(){
    
        this.queue.shift();
    
        if(this.queue.length === 0){
    
          this.voiceChannel.leave();
        }
    
        else {
    
          this.selector(this.voiceChannel);
    
        }
    }
}