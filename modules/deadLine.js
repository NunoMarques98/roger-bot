const DeadLineModel = require('../models/deadLineSchema');

const flagTable = require('../flags.json').deadlineFlagTable;
const dateRegex = /^[0-9]{4}\/[0-9]{2}\/[0-9]{2}$/;
const nameStart = 13;

class DeadLine {

    constructor(initDate, finishDate, id, alias, name, fileFormat, serverID) {

        this.initDate = initDate;
        this.finishDate = finishDate;
        this.id = id;
        this.alias = alias;
        this.name = name;
        this.fileFormat = fileFormat;
        this.serverID = serverID;
    }

    static routeDeadLineCommands(flag, message)  {

        let match = flag.match(/^-(u[idfn]|o|tl|c)$/);

        if(match != null) {

            let matchedCommand = match[0];
            let values = message.content.split(" ");

            switch (matchedCommand) {

                case "-o":

                    this.printOpenDeadLines(message);

                    return {success: true, msg: null};

                case "-c":
            
                    let dead = new DeadLine(values[2], values[3], message.memberID, message.alias, values[4], values[5], message.guildID);

                    dead.saveDeadLine();

                    return {success: true, msg: "Created deadline!"}

                case "-tl":

                    this.timeLeft(values);

                    return {success: true, msg: null};

                default:

                    this.updateDeadLineField(message, values);

                    return {success: true, msg: "Field updated!"}
            }
        }

        else return {success :false, msg: "Invalid command"};

    }

    static async printOpenDeadLines(message) {

        let name = message.content.substring(nameStart);
        let query = {serverID: message.guildID, createdByAlias: name};

        let docs = await DeadLineModel.getOpenDeadLines(query);

        let deadLinesTable = "```\n | Name | Creator | Init Date | Finish Date | File Format |\n |------|---------|-----------|-------------|-------------|\n";

        docs.forEach( (doc) => {

            let initDate = doc.initDate.getFullYear() + '/' + (doc.initDate.getMonth() + 1) + '/' + doc.initDate.getDate(); 
            let finishDate = doc.finishDate.getFullYear() + '/' + (doc.finishDate.getMonth() + 1) + '/' + doc.finishDate.getDate(); 

            deadLinesTable += ` | ${doc.name.substring(0, 4)} | ${doc.createdByAlias.substring(0, 7)} | ${initDate} |  ${finishDate}  |     ${doc.fileFormat}     |\n`;

        })

        deadLinesTable += "```";
        message.channel.send(deadLinesTable);
    }

    static async timeLeft(values) {

        let name = values[2];
        let date = new Date();

        let query = {serverID: message.guildID, name: name};

        let res = await DeadLineModel.getDeadLine(query);

        let initDate = res.initDate;
        let finishDate = res.finishDate;

        if(initDate > date) message.channel.send("Submission has not started yet!");

        else if(finishDate < date) message.channel.send("Submission has ended!");

        else {

            let seconds = (finishDate - date) / 1000;

            message.channel.send(this.getDate(seconds));
        }
    }

    static getDate(seconds) {

        let days = Math.floor(seconds / 86400);
    
        seconds %= (24 * 3600);
    
        let hours = Math.floor(seconds / 3600);
    
        seconds %= 3600;
    
        let minutes = Math.floor(seconds / 60 );
    
        seconds %= 60;
    
        let secondsLeft = Math.floor(seconds  / 60);
    
        return `Ends in: ${days}d:${hours}h:${minutes}m:${secondsLeft}s`;
        
    }

    static formatDate(updateValue) {
    
        let matchDate = updateValue.match(dateRegex);
    
        if(matchDate === null)
    
            return {success: false, msg: "Start date not corretly formated. Expression must be similar to yyyy/mm/dd.\n y, m, d are digits from 0 to 9!"};
    
        let dateComponents = updateValue.split("/");
    
        updateValue = new Date(parseInt(dateComponents[0]), parseInt(dateComponents[1]) - 1, parseInt(dateComponents[2]));
    
        return updateValue;

    }

    static updateDeadLineField(message, values) {

        let query = {serverID: message.guildID, name: values[3]};
        let update = flagTable[matchedCommand];

        let updateValue = values[2];

        let key = Object.keys(update)[0];

        if(matchedCommand === '-ui' || matchedCommand === '-ud') updateValue = this.formatDate(updateValue);

        update[key] = updateValue;

        DeadLineModel.updateFields(query, update);
    }

    saveDeadLine() {

        let initLine = this.initDate;
        let finishLine = this.finishDate;
        let name = this.name;
        let fileFormat = this.fileFormat;

        if(initLine === undefined || finishLine === undefined || name === undefined || fileFormat === undefined)

            return {success: false, msg: "One of the parameters needed is missing. Please check if your command is similar to the following template\n $deadline -c yyyy/mm/dd yyyy/mm/dd deadlineName fileFormat"};

        let matchInitDate = initLine.match(dateRegex);
        let matchFinishDate = finishLine.match(dateRegex);

        if(matchInitDate === null) 

            return {success: false, msg: "Start date not corretly formated. Expression must be similar to yyyy/mm/dd.\n y, m, d are digits from 0 to 9!"};

        if(matchFinishDate === null)

            return {success: false, msg: "End date not corretly formated. Expression must be similar to yyyy/mm/dd.\n y, m, d are digits from 0 to 9!"};

        let initDateComponents = initLine.split("/");
        let finishDateComponents = finishLine.split("/");

        let initDate = new Date(parseInt(initDateComponents[0]), parseInt(initDateComponents[1]) - 1, parseInt(initDateComponents[2]));
        let finishDate = new Date(parseInt(finishDateComponents[0]), parseInt(finishDateComponents[1]) - 1, parseInt(finishDateComponents[2]));

        DeadLineModel.createDeadLine(initDate, finishDate, this.id, this.alias, name, fileFormat, this.guildID);
    }
    
}

module.exports = DeadLine;