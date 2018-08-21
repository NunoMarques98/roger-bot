import * as Mongo from "mongoose";

const dateRegex : RegExp = /^[0-9]{4}\/[0-9]{2}\/[0-9]{2}$/;

const DeadLineSchema = new Mongo.Schema({

    initDate: Date,
    finishDate: Date,
    createdByID: String,
    createdByAlias: String,
    name: String,
    fileFormat: String,
    serverID: String

})

const DeadLine = Mongo.model("Deadline", DeadLineSchema);

function createDeadLine(initDate : Date, finishDate : Date, id : string, alias : string, name :  string, fileFormat : string, serverID : string) : void {
    
    let deadline : Mongo.Document = new DeadLine({

        initDate: initDate,
        finishDate: finishDate,
        createdByID: id,
        createdByAlias: alias,
        name: name,
        fileFormat: fileFormat,
        serverID: serverID
    })

    deadline.save( err => { if (err) throw err});
}

function updateFields(query : Object, update : Object) : void {

    DeadLine.findByIdAndUpdate(query, update, err => {

        if (err) throw err;
    })
}

function getOpenDeadLines(query : Object) : Promise<any> {
    
    return new Promise( (resolve, reject) => {

        let date : Date = new Date();

        let result : Mongo.Query<any> = DeadLine.find(query).where('initDate').lte(date).where('finishDate').gte(date);

        result.exec( (err, res) => {

            if (err) reject(err);

            resolve(res);
        })
    })
}

function getDeadLine(query : Object) : Promise<any> {
    
    return new Promise( (resolve, reject) => {

        DeadLine.findOne(query, (err, res) => {

            if (err) reject(err);

            resolve(res);
        })
    })
}

export { createDeadLine, updateFields, getOpenDeadLines, getDeadLine };