"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Mongo = require("mongoose");
const dateRegex = /^[0-9]{4}\/[0-9]{2}\/[0-9]{2}$/;
const DeadLineSchema = new Mongo.Schema({
    initDate: Date,
    finishDate: Date,
    createdByID: String,
    createdByAlias: String,
    name: String,
    fileFormat: String,
    serverID: String
});
const DeadLine = Mongo.model("Deadline", DeadLineSchema);
function createDeadLine(initDate, finishDate, id, alias, name, fileFormat, serverID) {
    let deadline = new DeadLine({
        initDate: initDate,
        finishDate: finishDate,
        createdByID: id,
        createdByAlias: alias,
        name: name,
        fileFormat: fileFormat,
        serverID: serverID
    });
    deadline.save(err => { if (err)
        throw err; });
}
exports.createDeadLine = createDeadLine;
function updateFields(query, update) {
    DeadLine.findByIdAndUpdate(query, update, err => {
        if (err)
            throw err;
    });
}
exports.updateFields = updateFields;
function getOpenDeadLines(query) {
    return new Promise((resolve, reject) => {
        let date = new Date();
        let result = DeadLine.find(query).where('initDate').lte(date).where('finishDate').gte(date);
        result.exec((err, res) => {
            if (err)
                reject(err);
            resolve(res);
        });
    });
}
exports.getOpenDeadLines = getOpenDeadLines;
function getDeadLine(query, date) {
    return new Promise((resolve, reject) => {
        let composedQuery = DeadLine.findOne(query).where('initDate').lte(date).where('finishDate').gte(date);
        composedQuery.exec((err, res) => {
            if (err)
                reject(err);
            resolve(res);
        });
    });
}
exports.getDeadLine = getDeadLine;
//# sourceMappingURL=DeadLineSchema.js.map