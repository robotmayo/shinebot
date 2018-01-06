"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const snog_1 = require("@openfin/snog");
const wrap_1 = require("./wrap");
const log = snog_1.default.make("shinebot");
const client = new Discord.Client();
client.on("ready", () => {
    log.info("Ready!");
});
client.on("message", async (message) => {
    if (message.content.startsWith("!ping")) {
        const r = await wrap_1.default(message.reply("pong"));
        if (r.isErr()) {
            log.error("Error sending message", r.unwrapErr());
        }
    }
});
async function login(token) {
    const r = await wrap_1.default(client.login(token));
    if (r.isErr()) {
        log.error("error logging in", r.unwrapErr());
    }
    else {
        log.info("Logged in succesfully");
    }
}
login("Mjk3MTE2Njg3MTg1MjE1NDg4.DSx-jg.Ao-44D9aGLtSybDN27wu1pXUcIU").catch(log.error);
//# sourceMappingURL=index.js.map