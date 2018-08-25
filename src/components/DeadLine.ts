import { getOpenDeadLines, getDeadLine, updateFields, createDeadLine } from "../database_models/DeadLineSchema";

import { deadlineFlagTable } from "../../flags.json";
import { Message } from "discord.js";

const dateRegex : RegExp = /^[0-9]{4}\/[0-9]{2}\/[0-9]{2}$/;
const deadLineRegex : RegExp = /^-(u[idfn]|o|tl|c)$/;
const nameStart : number = 13;

export default class DeadLine {

    initDate : string;
    finishDate : string;
    id : string;
    alias : string;
    name : string;
    fileFormat : string;
    serverID : string;

    constructor(initDate : string, finishDate : string, id : string, alias : string, name : string, fileFormat : string, serverID : string) {

        this.initDate = initDate;
        this.finishDate = finishDate;
        this.id = id;
        this.alias = alias;
        this.name = name;
        this.fileFormat = fileFormat;
        this.serverID = serverID;
    }

    static routeDeadLineCommands(flag : string, message : Message)  {

        let matchedCommand : string = flag.match(deadLineRegex)[0];

        if(matchedCommand) {

            let values : Array<string> = message.content.split(" ");

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

        else throw "Invalid command";

    }


    static async printOpenDeadLines(message : Message) {

        let name : string = message.content.substring(nameStart);
        let query : object = {serverID: message.guild.id, createdByAlias: name};

        let docs : any = await getOpenDeadLines(query);

        let deadLinesTable : string = "```\n | Name | Creator | Init Date | Finish Date | File Format |\n |------|---------|-----------|-------------|-------------|\n";

        docs.array.forEach( (doc : any) => {
            
            let initDate : string = doc.initDate.getFullYear() + '/' + (doc.initDate.getMonth() + 1) + '/' + doc.initDate.getDate(); 
            let finishDate : string = doc.finishDate.getFullYear() + '/' + (doc.finishDate.getMonth() + 1) + '/' + doc.finishDate.getDate(); 

            deadLinesTable += ` | ${doc.name.substring(0, 4)} | ${doc.createdByAlias.substring(0, 7)} | ${initDate} |  ${finishDate}  |     ${doc.fileFormat}     |\n`;

        });

        deadLinesTable += "```";
        message.channel.send(deadLinesTable);
    }

    static async timeLeft(message : Message, values : Array<string>) {

        let name : string = values[2];
        let date : any = new Date();
        
        let query : Object = {serverID: message.guild.id, name: name};

        let res = await getDeadLine(query, date);
        

        if(!res) message.channel.send("Submission may already be over or it has not started yet!");

        else {
            let finishDate : number = res.finishDate;

            let seconds = (finishDate - date) / 1000;

            message.channel.send(this.getDate(seconds));
        }
    }

    static getDate(seconds : number) : string {

        let days : number = Math.floor(seconds / 86400);
    
        seconds %= (24 * 3600);
    
        let hours : number = Math.floor(seconds / 3600);
    
        seconds %= 3600;
    
        let minutes : number = Math.floor(seconds / 60 );
    
        seconds %= 60;
    
        let secondsLeft : number = Math.floor(seconds  / 60);
    
        return `Ends in: ${days}d:${hours}h:${minutes}m:${secondsLeft}s`;
        
    }

    static formatDate(date : string) : Date {

        if(dateRegex.test(date)) {

            let dateComponents : Array<string> = date.split("/");

            let dateFormated : Date = new Date(parseInt(dateComponents[0]), parseInt(dateComponents[1]) - 1, parseInt(dateComponents[2]));

            return dateFormated;

        }

        else throw "Start date not corretly formated. Expression must be similar to yyyy/mm/dd.\n y, m, d are digits from 0 to 9!";
    }

    static updateDeadLineField(message : Message, values : Array<string>, flag : string) {

        let query : object = {serverID: message.guild.id, name: values[3]};
        let update : any = (<any> deadlineFlagTable)[flag];

        let updateValue : any = values[2];

        let key : string = Object.keys(update)[0];

        if(flag === '-ui' || flag === '-ud') updateValue = this.formatDate(updateValue);

        update[key] = updateValue;

        updateFields(query, update);
    }

    saveDeadLine() : void {

        let initLine : string = this.initDate;
        let finishLine : string = this.finishDate;
        let name : string = this.name;
        let fileFormat : string = this.fileFormat;

        if(!this.checkFields(initLine, finishLine, name, fileFormat))
           throw "One of the parameters needed is missing. Please check if your command is similar to the following template\n $deadline -c yyyy/mm/dd yyyy/mm/dd deadlineName fileFormat";

        if(!dateRegex.test(initLine)) 

            throw "Start date not corretly formated. Expression must be similar to yyyy/mm/dd.\n y, m, d are digits from 0 to 9!";

        if(!dateRegex.test(finishLine))

            throw "End date not corretly formated. Expression must be similar to yyyy/mm/dd.\n y, m, d are digits from 0 to 9!";

        let initDateComponents : Array<string> = initLine.split("/");
        let finishDateComponents : Array<string> = finishLine.split("/");

        let initDate : Date = new Date(parseInt(initDateComponents[0]), parseInt(initDateComponents[1]) - 1, parseInt(initDateComponents[2]));
        let finishDate : Date = new Date(parseInt(finishDateComponents[0]), parseInt(finishDateComponents[1]) - 1, parseInt(finishDateComponents[2]));

        createDeadLine(initDate, finishDate, this.id, this.alias, name, fileFormat, this.serverID);
    }

    checkFields(initLine : string, finishLine : string, name : string, fileFormat : string) : boolean {

        if(initLine === undefined || finishLine === undefined || name === undefined || fileFormat === undefined)

            return false;

        return true;
    }
}