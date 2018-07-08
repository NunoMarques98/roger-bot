const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const flagTable = require('../flag.json').deadlineFlagTable;

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

            

            return true;
        }

        else return false;

    },

    updateFields(query, update) {

        DeadLine.findOneAndUpdate(query, update, (err) => {

            if (err) throw err;
        })
    }
};
