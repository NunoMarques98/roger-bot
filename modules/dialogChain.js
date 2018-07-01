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

        this.channel.send(dialogToChange.question);

        dialogToChange.setAnswer(answer);
    }

    initDialog() {

        let collector = this.channel.createMessageCollector(m => m !== undefined);

        collector.on('collect', (m) => {

            do {
                
                this.channel.send(this.dialogs[this.fase].question);

                this.dialogs[this.fase].setAnswer(m.content);

                this.fase++;

            } while (m.content.match(/done/i) === null && this.fase < this.dialogs.length);

            collector.stop();

            this.fase = 0;
        })
    }
}