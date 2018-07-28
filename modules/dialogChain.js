const Dialog = require('./dialog');
module.exports = class DialogChain {

    constructor(channel, dialogs, beginMessage, endMessage) {

        this.dialogs = dialogs || [];
        this.fase = 0;
        this.channel = channel;
        this.beginMessage = beginMessage;
        this.endMessage = endMessage;
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

            channel.send(this.beginMessage);

            channel.send(this.dialogs[0].question);

            collector.on('collect', (m) => {

                let content = m.content;

                if(content.match(/done/i) !== null) collector.stop();
    
                if(content.match(/([0-9]{18}|\w{1,20}|\s)/gm) !== null) {

                    this.dialogs[this.fase].setAnswer(content);

                    this.fase++;

                    if(this.fase >= this.dialogs.length) collector.stop();

                    else channel.send(this.dialogs[this.fase].question);

                } else channel.send("Answer not correctly formated!");

            })

            collector.on('end', () => {

                channel.send(this.endMessage)

                callback(this.dialogs);
            })

            this.fase = 0;
        })
    }
}