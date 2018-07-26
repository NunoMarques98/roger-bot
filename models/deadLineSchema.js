const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

    updateFields(query, update) {

        DeadLine.findOneAndUpdate(query, update, (err) => {

            if (err) throw err;
        })
    },

    getOpenDeadLines(query) {

        return new Promise( (resolve, reject) => {

            let date = new Date();

            let result = DeadLine.find(query).where('initDate').lte(date).where('finishDate').gte(date);

            result.exec( (err, res) => {

                if (err) throw reject(err);

                resolve(res);
            })
        })
    },

    getDeadLine(query) {

        return new Promise( (resolve, reject) => {

            DeadLine.findOne(query, (err, res) => {

                if (err) reject(err);
    
                resolve(res);
            })
        })
    },

    verifyOnSchedule(deadline, date) {

        let initDate = deadline.initDate;
        let finishDate = deadline.finishDate;

        return ((initDate <= date) && (date <= finishDate));
    }
};
