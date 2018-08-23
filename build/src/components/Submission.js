"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DeadLineSchema_1 = require("../database_models/DeadLineSchema");
class Submission {
    constructor(fromAlias, deadLineName, attachmentURL, submissionDate) {
        this.fromAlias = fromAlias;
        this.deadLineName = deadLineName;
        this.attachmentURL = attachmentURL;
        this.submissionDate = submissionDate;
    }
    static createSubmission(message) {
        let attachmentURL = message.attachments.first().url;
        let deadLineName = message.content.split(" ")[1];
        let date = new Date();
        let submission = new Submission(message.author.username, deadLineName, attachmentURL, date);
        let query = { serverID: message.guild.id, name: deadLineName };
        DeadLineSchema_1.getDeadLine(query, date).then(deadLine => {
            if (deadLine) {
                let deadLineCreator = submission.fetchCreator(deadLine, message.guild);
                submission.reportTo(deadLineCreator);
            }
            //else throw "No deadline open for your submission"
        }).catch(err => {
            console.log(err);
        });
    }
    fetchCreator(deadLine, guild) {
        let members = guild.members;
        let creator = members.filterArray(member => member.id === deadLine.createdByID);
        return creator[0];
    }
    reportTo(member) {
        member.createDM().then(channel => {
            channel.send("Hello loser!");
            channel.send(`A file has been submitted by ${this.fromAlias} at ${this.submissionDate}\n`);
            channel.send({ files: [this.attachmentURL] });
        }).catch(err => {
            console.log(err);
        });
    }
}
exports.default = Submission;
//# sourceMappingURL=Submission.js.map