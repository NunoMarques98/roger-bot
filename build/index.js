"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const settings_json_1 = require("./settings.json");
const Discord = require("discord.js");
const Mongo = require("mongoose");
const client = new Discord.Client();
client.login(settings_json_1.token);
Mongo.connect(settings_json_1.dbLink).then(() => {
    console.log("Connected...");
})
    .catch((err) => {
    console.log(err);
});
//# sourceMappingURL=index.js.map