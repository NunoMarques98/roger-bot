import Dialog from "./Dialog";
import { TextChannel, GuildMember, MessageCollector } from "discord.js";

export default class DialogChain {

    dialogs : Array<Dialog> = [];
    fase : number = 0;
    beginMessage : string;
    endMessage : string;

    constructor(dialogs : Array<Dialog>, beginMessage : string, endMessage : string) {

        this.dialogs = dialogs || [];
        this.beginMessage = beginMessage;
        this.endMessage = endMessage;

    }

    addDialog(dialog : Dialog) : void {

        this.dialogs.push(dialog);
    }

    modifyDialog(fase : number, answer : string, channel : TextChannel) : void {

        let dialogToChange = this.dialogs[fase];

        channel.send(dialogToChange.question);

        dialogToChange.setAnswer(answer);
    }

    initDialog(owner : GuildMember) : Promise<any> {

        return new Promise( (resolve, reject) => {

            owner.createDM().then( channel => {

                let collector : MessageCollector = channel.createMessageCollector(m => !m.author.bot);

                channel.send(this.beginMessage);

                channel.send(this.dialogs[0].question);

                collector.on("collect", m => {

                    let content : string = m.content;

                    if(!!content.match(/done/i)) collector.stop();

                    if(!!content.match(/([0-9]{18}|\w{1,20}|\s)/gm)) {

                        this.dialogs[this.fase].setAnswer(content);

                        this.fase++;

                        if(this.fase >= this.dialogs.length) collector.stop();

                        else channel.send(this.dialogs[this.fase].question);

                    }

                    else channel.send("Answer not correctly formated!")
                })

                collector.on('end', () => {

                    channel.send(this.endMessage);

                    resolve(this.dialogs);
                })

                this.fase = 0;
            })
        })
    }
}