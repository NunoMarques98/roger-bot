const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeadLineSchema = new Schema({

    initDate: Date,
    finishDate: Date,
    createdByID: Number,
    name: String,
    fileFormat: String

});

const DeadLine = mongoose.model("deadline", DeadLineSchema);

module.exports = DeadLine;
