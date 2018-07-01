const Dialog = require('./dialog');
module.exports = class DialogChain {

    constructor(channel, dialogs) {

        this.dialogs = dialogs;
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

    initDialog(owner, callback) {

        owner.createDM().then( (channel) => {

            let collector = channel.createMessageCollector(m => !m.author.bot);

            console.log("joined");

            channel.send("Let's setup the ship!");

            collector.on('collect', (m) => {

                let content = m.content;

                if(content.match(/done/i) === null || this.fase >= this.dialogs.length) collector.stop();
    
                channel.send(this.dialogs[this.fase].question);

                if(content.match(/[0-9]{18}/) !== null) {

                    this.dialogs[this.fase].setAnswer(content);

                    this.fase++;

                } else channel.send("Answer not correctly formated!");

            })

            this.fase = 0;

        })

        callback("hello");
    }
}