import * as Discord from "discord.js";
import { token } from "../../../settings.json";

import DialogChain from "../../components/DialogChain";
import Dialog from "../../components/Dialog";

let dialogChain : DialogChain;
let channel : Discord.TextChannel;
let client : Discord.Client = new Discord.Client();

beforeAll( async () => {

    await client.login(token);

    channel = <Discord.TextChannel> client.channels.filter(channel => channel.type === "text").first();
})

beforeEach( () => {

    dialogChain = new DialogChain(null, "test init", "test end");
})

describe("Dialog chain tests", () => {

    test("Property test", () => {

        expect(dialogChain).toHaveProperty("dialogs");
        expect(dialogChain).toHaveProperty("beginMessage");
        expect(dialogChain).toHaveProperty("endMessage");
    })

    test("Adding new dialog with empty chain", () => {

        expect(dialogChain.dialogs).toHaveLength(0);
    })

    test("Adding new dialog with not-empty chain", () => {

        let newDialog : Dialog = new Dialog("test");

        dialogChain.addDialog(newDialog);

        expect(dialogChain.dialogs).toHaveLength(1);
    })

    test("Modifying dialog", () => {

        let newDialog : Dialog = new Dialog("test");

        dialogChain.addDialog(newDialog);

        dialogChain.modifyDialog(0, "test", channel);

        expect(dialogChain.dialogs[0].answer).toBe("test");
    })
})