import Dialog from "./Dialog";
import * as Discord from "discord.js";
import { changeID } from "../database_models/ServerSchema";

export default class DialogChain {

    dialogs : Array<Dialog> = [];
    fase : number = 0;
    channel : Discord.TextChannel;
    beginMessage : string;
    endMessage : string;

    constructor(channel : Discord.TextChannel, dialogs : Array<Dialog>, beginMessage : string, endMessage : string) {

        this.dialogs = dialogs;
        this.channel = channel;
        this.beginMessage = beginMessage;
        this.endMessage = endMessage;

    }

    addDialog(dialog : Dialog) : void {

        this.dialogs.push(dialog);
    }

    modifyDialog(fase : number, answer : string) : void {

        let dialogToChange = this.dialogs[fase];

        this.channel.send(dialogToChange.question);

        dialogToChange.setAnswer(answer);
    }

    initDialog(owner : Discord.GuildMember) : Promise<any> {

        return new Promise( (resolve, reject) => {

            owner.createDM().then( channel => {

                let collector : Discord.MessageCollector = channel.createMessageCollector(m => !m.author.bot);

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