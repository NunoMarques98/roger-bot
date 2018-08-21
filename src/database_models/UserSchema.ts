import * as Mongo from "mongoose";

const START_GOLD : number = 0;
const START_PLAYLIST : number = 0;
const MAX_PLAYLIST : number = 5;
const START_LEVEL : number = 1;
const START_EXP : number = 0;
const START_RANK : string = "Powder Monkey";

const FACTOR : number = 5;

const UserSchema : Mongo.Schema = new Mongo.Schema({

    name: String,
    userID: String,
    numPlaylists: Number,
    maxPlaylists: Number,
    level: Number,
    currExp: Number,
    expToLevelUp: Number,
    rank: String,
    gold: Number

})

const User : Mongo.Model<any> = Mongo.model("User", UserSchema);

function nextExp(level : number) : number {
    
    let expNeeded : number = FACTOR*(level + 1)*Math.log10(level + 1);

    return Math.floor(expNeeded);
}

function checkExistance(id:string) : Promise<any> {
    
    return new Promise( (resolve, reject) => {

        User.findOne({userID: id}).then( data => {

            resolve(!!data);
        })
    })
}

function createUser(name : string, id : string) : Promise<any> {
    
    return new Promise(async (resolve, reject) => {

        let exists : boolean = await checkExistance(id);

        if(exists) resolve(":bomb: Welcome back lad. We are short on people to feed the Kraken! :octopus:");

        else {

            let user : Mongo.Document = new User({

                name: name,
                userID: id,
                numPlaylists: START_PLAYLIST,
                maxPlaylists: MAX_PLAYLIST,
                level: START_LEVEL,
                currExp: START_EXP,
                expToLevelUp: nextExp(START_LEVEL),
                rank: START_RANK,
                gold: START_GOLD
            })

            user.save( (err) => { if(err) throw err });

            resolve(":sailboat: Welcome aboard sailor! Settle in with the crew and have some rum lad! :champagne:")
        }
    })
}

export { User, createUser };