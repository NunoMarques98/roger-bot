import * as Discord from "discord.js";
import { checkCommands, getCommandParts, handleCommands } from "../../components/CommandHandler";
import { token } from "../../../settings.json";

let message : Discord.Message;
let messageWithWrongCommand : Discord.Message;
let channel : Discord.TextChannel;
let client : Discord.Client = new Discord.Client();

beforeAll( async () => {

    await client.login(token);
})

beforeEach(async () => {

    channel = <Discord.TextChannel> client.channels.filter(channel => channel.type === "text").first();

    message = await <any> channel.send("$deadline -o Absolute");
    messageWithWrongCommand = await <any> channel.send("$pl test");
})

afterEach(() => {

    
})

afterAll( () => {

    client.destroy();
})

test("Separating command parts test", () => {

    let parts : Array<string> = getCommandParts(message);

    expect(parts).toHaveLength(3);
    expect(Array.isArray(parts)).toBe(true);
})

test("Command calling", () => {

    expect( () => {checkCommands(messageWithWrongCommand)}).toThrowError()
})