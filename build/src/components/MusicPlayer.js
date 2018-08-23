"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ytdl = require("ytdl-core");
const youtubeRegex = /^https?:\/\/(www.youtube.com|youtube.com)/;
let dispatcher;
let voiceChannel;
let queue = [];
function enqueue(message) {
    let url = message.content.slice(6);
    url = url.replace("'", '"');
    if (youtubeRegex.test(url))
        queue.push(url);
}
function selector(voiceChannel) {
    voiceChannel = voiceChannel;
    voiceChannel.join().then(connection => {
        play(connection);
        dispatcher.on("end", () => {
            next();
        });
    });
}
function play(connection) {
    let music = ytdl(queue[0], { filter: (format) => format.container === 'mp4' });
    dispatcher = connection.playStream(music);
}
function playing() {
    return queue[0];
}
function handler(message) {
    voiceChannel = message.member.voiceChannel;
    if (queue.length === 0) {
        enqueue(message);
        selector(voiceChannel);
    }
    else {
        enqueue(message);
    }
}
exports.handler = handler;
function skip() {
    dispatcher.end();
}
function next() {
    queue.shift();
    if (queue.length === 0) {
        voiceChannel.leave();
    }
    else {
        selector(voiceChannel);
    }
}
//# sourceMappingURL=MusicPlayer.js.map