const DeadLine = require('../models/deadLineSchema');

class Subimission {

    constructor(fromAlias, deadLineName, attachmentURL, submissionDate) {

        this.fromAlias = fromAlias;
        this.deadLineName = deadLineName;
        this.attachmentURL = attachmentURL;
        this.submissionDate = submissionDate;
    }

    static async routeSubmission(message) {

        let attachmentURL = message.attachment.url;
        let deadLineName = message.content.split(" ")[1];

        let subimission = new Subimission(message.alias, deadLineName , attachmentURL, new Date());

        let query = {serverID: message.guildID, name: deadLineName};
        
        DeadLine.getDeadLine(query).then( deadLine => {

            console.log(deadLine);

            if(true) {

                let deadLineCreator = subimission.fetchCreator(deadLine, message.guild);
    
                this.reportSubmission(subimission, deadLineCreator);
            }
        });
    }

    static reportSubmission(subimission, user) {

        user.createDM().then( (channel) => {

            console.log(user);
            
            channel.send(`A file has been submitted by ${subimission.fromAlias} at ${subimission.submissionDate}\n`);

            channel.send({files: [subimission.attachmentURL]});
        })
    }

    fetchCreator(deadLine, guild) {

        let members = guild.members;

        let creator = members.filterArray( (member) => member.id === deadLine.createdByID);

        return creator[0];
    }
}

module.exports = Subimission;