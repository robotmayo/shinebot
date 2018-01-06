import * as Discord from "discord.js";
import log from "./util/logger";
import wrap from "./util/wrap";

import Shinebot from "./core";
import FairDiceRoll from "./plugins/fair-dice-roll";
async function start(token: string) {
  const client = new Discord.Client();
  const s = new Shinebot(client, token);
  s.addPlugin(new FairDiceRoll());
  await s.init();
}

start("Mjk3MTE2Njg3MTg1MjE1NDg4.DSx-jg.Ao-44D9aGLtSybDN27wu1pXUcIU").catch(
  log.error
);
