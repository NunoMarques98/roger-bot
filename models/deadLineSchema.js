const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const flagTable = require('../flag.json').deadlineFlagTable;
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

    createDeadLine: (initDate, finishDate, id, alias, name, fileFormat, serverID) => {

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

    routeDeadLineCommands: (flag, message) => {

        let match = flag.match(/^-(u[idfn]|o|tl)$/);

        if(match != null) {

            let matchedCommand = match[0];


            if(matchedCommand === '-o') {

                let query = {serverID: message.guildID};

                this.getOpenDeadLines(query, (docs) => {

                    console.log(docs);
                });
            }

            else if(matchedCommand === '-c') {

                let values = message.content.split(" ");
              
                let initLine = values[0];
                let finisLine = values[1];
                let name = values[2];
                let fileFormat = values[3];

                let matchInitDate = initLine.match(dateRegex);
                let matchFinishDate = finishLine.match(dataRegex);

                if(matchInitDate === null) 

                    return {success: false, msg: "Start date not corretly formated. Expression must be similar to yyyy/mm/dd.\n y, m, d are digits from 0 to 9!"};

                if(matchFinishDate === null)

                    return {success: false, msg: "End date not corretly formated. Expression must be similar to yyyy/mm/dd.\n y, m, d are digits from 0 to 9!"};

                let initDateComponents = initLine.split("/");
                let finishDateComponents = finisLine.split("/");

                let initDate = new Date(parseInt(initDateComponents[0]), parseInt(initDateComponents[1]), parseInt(initDateComponents[2]));
                let finishDate = new Date(parseInt(finishDateComponents[0]), parseInt(finishDateComponents[1]), parseInt(finishDateComponents[2]));

                this.createDeadLine(initDate, finishDate, name, fileFormat);
            }

            return true;
        }

        else return false;

    },

    updateFields(query, update) {

        DeadLine.findOneAndUpdate(query, update, (err) => {

            if (err) throw err;
        })
    },

    getOpenDeadLines(query, callback) {

        DeadLine.find(query, (docs) => {

            if(err) throw err;

            callback(docs);
        })
    }
};
