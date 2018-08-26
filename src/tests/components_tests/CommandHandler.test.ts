import * as Discord from "discord.js";
import { checkCommands, getCommandParts, handleCommands } from "../../components/CommandHandler";
import { token } from "../../../settings.json";
import { createHash } from "crypto";

let message : Discord.Message;
let messageWithWrongCommand : Discord.Message;
let emptyMessage : Discord.Message;
let channel : Discord.TextChannel;
let client : Discord.Client = new Discord.Client();

beforeAll( async () => {

    await client.login(token);

    channel = <Discord.TextChannel> client.channels.filter(channel => channel.type === "text").first();

    message = await <any> channel.send("$deadline -o Absolute");
    messageWithWrongCommand = await <any> channel.send("$pl test");
    emptyMessage = await <any> channel.send("Empty");

    emptyMessage.content = "";
})

afterAll( () => {

    client.destroy();
})

describe("Command handling tests", () => {

    test("Getting command parts test with non empty message", () => {

        let parts : Array<string> = getCommandParts(message);
    
        expect(parts).toHaveLength(3);
        expect(Array.isArray(parts)).toBe(true);
    })

    test("Getting command parts with empty message", () => {

        let parts : Array<string> = getCommandParts(emptyMessage);

        expect(parts).toHaveLength(1);
        expect(Array.isArray(parts)).toBe(true);
    })
    
    test("Command calling test with not known command", () => {
    
        expect( () => { checkCommands(messageWithWrongCommand) }).toThrowError("Command not found!")
    })

    test("Command calling test with known command", () => {
    
        expect( () => { checkCommands(message) }).not.toThrowError();
    })
})

