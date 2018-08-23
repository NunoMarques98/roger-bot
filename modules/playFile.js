//const { Playlist } = require('../models/playlistSchema');
const fs = require('fs');
const ytdl = require('ytdl-core');

module.exports = class PlayFile {

    constructor() {

        this.dispatcher;
        this.voiceChannel;
        this.queue = [];
    }

    enqueue(message){

        let url = message.content.slice(6);
    
        let music = url.replace("'", '"');
    
        if(music.match(/^https?:\/\/(www.youtube.com|youtube.com)/)){
    
          this.queue.push(music);
    
        } else {
    
          youtube.searchVideos(music, 1).then( (results) =>{
    
            this.queue.enqueue(`https://www.youtube.com/watch?v=${results[0].id}`);
    
          })
        }
      };
    
      enqueueFromPl(musicLinks){
    
        musicLinks.forEach( (link) =>{
    
          let linkQ = link.replace("'", '"');
    
          this.queue.push(linkQ);
        })
      }
    
      selector(voiceChannel){
    
        this.voiceChannel = voiceChannel;
    
        voiceChannel.join().then( (connection) => {
    
            this.play(connection);
    
            this.dispatcher.on('end', () =>{
    
                this.next();
    
            })
          })
    
      };
    
      play(connection){
    
        let musicToPlay = ytdl(this.queue[0], { filter: (format) => format.container === 'mp4' })
                        
        this.dispatcher = connection.playStream(musicToPlay);
    
      };
    
      playing(){
    
        return this.queue[0];
      }
    
      handler(message){
    
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