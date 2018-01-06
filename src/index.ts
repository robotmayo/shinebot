import * as Discord from "discord.js";
import l from "@openfin/snog";
import wrap from "./util/wrap";

const log = l.make("shinebot");

const client = new Discord.Client();

client.on("ready", () => {
  log.info("Ready!");
});

client.on("message", async message => {
  if (message.content.startsWith("$daily")) {
    const r = await wrap(message.reply("pong"));
    if (r.isErr()) {
      log.error("Error sending message", r.unwrapErr());
    }
  }
});

async function login(token: string) {
  const r = await wrap(client.login(token));
  if (r.isErr()) {
    log.error("error logging in", r.unwrapErr());
  } else {
    log.info("Logged in succesfully");
  }
}

login("Mjk3MTE2Njg3MTg1MjE1NDg4.DSx-jg.Ao-44D9aGLtSybDN27wu1pXUcIU").catch(
  log.error
);
