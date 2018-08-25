"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DeadLineSchema_1 = require("../database_models/DeadLineSchema");
const flags_json_1 = require("../../flags.json");
const dateRegex = /^[0-9]{4}\/[0-9]{2}\/[0-9]{2}$/;
const deadLineRegex = /^-(u[idfn]|o|tl|c)$/;
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
    static routeDeadLineCommands(flag, message) {
        let matchedCommand = flag.match(deadLineRegex)[0];
        if (matchedCommand) {
            let values = message.content.split(" ");
            switch (matchedCommand) {
                case "-o":
                    this.printOpenDeadLines(message);
                case "-c":
                    let dead = new DeadLine(values[2], values[3], message.member.id, message.author.username, values[4], values[5], message.guild.id);
                    dead.saveDeadLine();
                case "-tl":
                    this.timeLeft(message, values);
                default:
                    this.updateDeadLineField(message, values, matchedCommand);
            }
        }
        else
            throw "Invalid command";
    }
    static async printOpenDeadLines(message) {
        let name = message.content.substring(nameStart);
        let query = { serverID: message.guild.id, createdByAlias: name };
        let docs = await DeadLineSchema_1.getOpenDeadLines(query);
        let deadLinesTable = "```\n | Name | Creator | Init Date | Finish Date | File Format |\n |------|---------|-----------|-------------|-------------|\n";
        docs.array.forEach((doc) => {
            let initDate = doc.initDate.getFullYear() + '/' + (doc.initDate.getMonth() + 1) + '/' + doc.initDate.getDate();
            let finishDate = doc.finishDate.getFullYear() + '/' + (doc.finishDate.getMonth() + 1) + '/' + doc.finishDate.getDate();
            deadLinesTable += ` | ${doc.name.substring(0, 4)} | ${doc.createdByAlias.substring(0, 7)} | ${initDate} |  ${finishDate}  |     ${doc.fileFormat}     |\n`;
        });
        deadLinesTable += "```";
        message.channel.send(deadLinesTable);
    }
    static async timeLeft(message, values) {
        let name = values[2];
        let date = new Date();
        let query = { serverID: message.guild.id, name: name };
        let res = await DeadLineSchema_1.getDeadLine(query, date);
        if (!res)
            message.channel.send("Submission may already be over or it has not started yet!");
        else {
            let finishDate = res.finishDate;
            let seconds = (finishDate - date) / 1000;
            message.channel.send(this.getDate(seconds));
        }
    }
    static getDate(seconds) {
        let days = Math.floor(seconds / 86400);
        seconds %= (24 * 3600);
        let hours = Math.floor(seconds / 3600);
        seconds %= 3600;
        let minutes = Math.floor(seconds / 60);
        seconds %= 60;
        let secondsLeft = Math.floor(seconds / 60);
        return `Ends in: ${days}d:${hours}h:${minutes}m:${secondsLeft}s`;
    }
    static formatDate(date) {
        if (dateRegex.test(date)) {
            let dateComponents = date.split("/");
            let dateFormated = new Date(parseInt(dateComponents[0]), parseInt(dateComponents[1]) - 1, parseInt(dateComponents[2]));
            return dateFormated;
        }
        else
            throw "Start date not corretly formated. Expression must be similar to yyyy/mm/dd.\n y, m, d are digits from 0 to 9!";
    }
    static updateDeadLineField(message, values, flag) {
        let query = { serverID: message.guild.id, name: values[3] };
        let update = flags_json_1.deadlineFlagTable[flag];
        let updateValue = values[2];
        let key = Object.keys(update)[0];
        if (flag === '-ui' || flag === '-ud')
            updateValue = this.formatDate(updateValue);
        update[key] = updateValue;
        DeadLineSchema_1.updateFields(query, update);
    }
    saveDeadLine() {
        let initLine = this.initDate;
        let finishLine = this.finishDate;
        let name = this.name;
        let fileFormat = this.fileFormat;
        if (!this.checkFields(initLine, finishLine, name, fileFormat))
            throw "One of the parameters needed is missing. Please check if your command is similar to the following template\n $deadline -c yyyy/mm/dd yyyy/mm/dd deadlineName fileFormat";
        if (!dateRegex.test(initLine))
            throw "Start date not corretly formated. Expression must be similar to yyyy/mm/dd.\n y, m, d are digits from 0 to 9!";
        if (!dateRegex.test(finishLine))
            throw "End date not corretly formated. Expression must be similar to yyyy/mm/dd.\n y, m, d are digits from 0 to 9!";
        let initDateComponents = initLine.split("/");
        let finishDateComponents = finishLine.split("/");
        let initDate = new Date(parseInt(initDateComponents[0]), parseInt(initDateComponents[1]) - 1, parseInt(initDateComponents[2]));
        let finishDate = new Date(parseInt(finishDateComponents[0]), parseInt(finishDateComponents[1]) - 1, parseInt(finishDateComponents[2]));
        DeadLineSchema_1.createDeadLine(initDate, finishDate, this.id, this.alias, name, fileFormat, this.serverID);
    }
    checkFields(initLine, finishLine, name, fileFormat) {
        if (initLine === undefined || finishLine === undefined || name === undefined || fileFormat === undefined)
            return false;
        return true;
    }
}
exports.default = DeadLine;
//# sourceMappingURL=DeadLine.js.map