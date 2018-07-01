const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeadLineSchema = new Schema({

    initDate: Date,
    finishDate: Date,
    createdByID: String,
    name: String,
    fileFormat: String

});

const DeadLine = mongoose.model("deadline", DeadLineSchema);

module.exports = {
    
    deadline: DeadLine,

    createDeadLine: (initDate, finishDate, id, name, fileFormat) => {

        let deadLineToCreate = new DeadLine({

            initDate: initDate,
            finishDate: finishDate,
            createdByID: id,
            name: name,
            fileFormat: fileFormat

        });

        deadLineToCreate.save( (err) => { if (err) throw err });
    }
};
