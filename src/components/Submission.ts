import { getDeadLine } from "../database_models/DeadLineSchema";

import { Message, Guild, Collection, GuildMember } from "discord.js";

interface DeadLine {

    initDate: Date,
    finishDate: Date,
    createdByID: string,
    createdByAlias: string,
    name: string,
    fileFormat: string,
    serverID: string
}


export default class Submission {

    fromAlias : string;
    deadLineName : string;
    attachmentURL : string;
    submissionDate : Date;

    constructor(fromAlias : string, deadLineName : string, attachmentURL : string, submissionDate : Date) {

        this.fromAlias = fromAlias;
        this.deadLineName = deadLineName;
        this.attachmentURL = attachmentURL;
        this.submissionDate = submissionDate
    }

    static createSubmission(message : Message) : void {

        let attachmentURL : string = message.attachments.first().url;
        let deadLineName : string = message.content.split(" ")[1];
        let date : Date = new Date();

        let submission : Submission = new Submission(message.author.username, deadLineName, attachmentURL, date);

        let query : Object = {serverID: message.guild.id, name : deadLineName};

        getDeadLine(query, date).then( deadLine => {

            if(deadLine) {

                let deadLineCreator : GuildMember = submission.fetchCreator(deadLine, message.guild);

                submission.reportTo(deadLineCreator);
            }

            //else throw "No deadline open for your submission"
        }).catch( err => {

            console.log(err)
        });

    }

    fetchCreator(deadLine : DeadLine, guild : Guild) : GuildMember {

        let members : Collection<string, GuildMember> = guild.members;

        let creator : Array<GuildMember> = members.filterArray( member => member.id === deadLine.createdByID);

        return creator[0];
    }

    reportTo(member : GuildMember) : void {

        member.createDM().then( channel => {
            
            channel.send(`A file has been submitted by ${this.fromAlias} at ${this.submissionDate}\n`);

            channel.send({files: [this.attachmentURL]});

        }).catch( err => {

            console.log(err);
        
        })
    }
}