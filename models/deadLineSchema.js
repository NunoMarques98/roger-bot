const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const flagTable = require('../flags.json').deadlineFlagTable;
const dateRegex = /^[0-9]{4}\/[0-9]{2}\/[0-9]{2}$/;

const DeadLineSchema = new Schema({

    initDate: Date,
    finishDate: Date,
    createdByID: String,
    createdByAlias: String,
    name: String,
    fileFormat: String,
    serverID: String

});

const DeadLine = mongoose.model("deadline", DeadLineSchema);

module.exports = {
    
    deadline: DeadLine,

    createDeadLine(initDate, finishDate, id, alias, name, fileFormat, serverID)  {

        let deadLineToCreate = new DeadLine({

            initDate: initDate,
            finishDate: finishDate,
            createdByID: id,
            createdByAlias: alias,
            name: name,
            fileFormat: fileFormat,
            serverID: serverID

        });

        deadLineToCreate.save( (err) => { if (err) throw err });
    },

    routeDeadLineCommands(flag, message)  {

        let match = flag.match(/^-(u[idfn]|o|tl|c)$/);

        if(match != null) {

            let matchedCommand = match[0];
            let values = message.content.split(" ");

            if(matchedCommand === '-o') {

                let query = {serverID: message.guildID};

                this.getOpenDeadLines(query, (docs) => {

                    console.log(docs);
                });

                return {success: true, msg: null}
            }

            else if(matchedCommand === '-c') {
              
                let initLine = values[2];
                let finishLine = values[3];
                let name = values[4];
                let fileFormat = values[5];

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

                let initDate = new Date(parseInt(initDateComponents[0]), parseInt(initDateComponents[1]), parseInt(initDateComponents[2]));
                let finishDate = new Date(parseInt(finishDateComponents[0]), parseInt(finishDateComponents[1]), parseInt(finishDateComponents[2]));

                this.createDeadLine(initDate, finishDate, message.memberID, message.alias, name, fileFormat, message.guildID);

                return {success: true, msg: "Created deadline!"}
            }

            else {

                let query = {serverID: message.guildID, name: values[3]};
                let update = flagTable[matchedCommand];

                let updateValue = values[2];

                let key = Object.keys(update)[0];

                if(matchedCommand === '-ui' || matchedCommand === '-ud') {

                    let matchDate = updateValue.match(dateRegex);

                    if(matchDate === null)

                        return {success: false, msg: "Start date not corretly formated. Expression must be similar to yyyy/mm/dd.\n y, m, d are digits from 0 to 9!"};

                    let dateComponents = updateValue.split("/");

                    updateValue = new Date(parseInt(dateComponents[0]), parseInt(dateComponents[1]), parseInt(dateComponents[2]));
                }

                update[key] = updateValue;

                console.log(update);

                this.updateFields(query, update);

                return {success: true, msg: "Field updated!"}
            }
        }

        else return {success :false, msg: "Invalid command"};

    },

    updateFields(query, update) {

        DeadLine.findOneAndUpdate(query, update, (err, data) => {

            if (err) throw err;

            console.log(data);
        })
    },

    getOpenDeadLines(query, callback) {

        DeadLine.find(query, (docs) => {

            if(err) throw err;

            callback(docs);
        })
    }
};
