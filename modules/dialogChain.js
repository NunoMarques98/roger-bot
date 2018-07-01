const Dialog = require('./dialog');
const Discord = require('discord.js');

class DialogChain {

    constructor(channel) {

        this.dialogs = [];
        this.fase = 0;
        this.channel = channel;
    }

    addDialog(dialog) {

        this.dialogs.push(dialog);
    }

    modifyDialog(fase, answer) {

        let dialogToChange = this.dialogs[fase];

        dialogToChange.setAnswer(answer);
    }

    
}