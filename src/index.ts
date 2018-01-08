import * as Discord from "discord.js";
import log from "./util/logger";
import wrap from "./util/wrap";
import * as dotenv from "dotenv";
dotenv.config();

import Shinebot from "./core";
import FairDiceRoll from "./plugins/fair-dice-roll";
import ShinesPlugin from "./plugins/shines";
async function start(token: string) {
  const client = new Discord.Client();
  const s = new Shinebot(client, token);
  s.addPlugin(new FairDiceRoll());
  s.addPlugin(new ShinesPlugin());
  await s.init();
}

start(process.env.DISCORD_TOKEN).catch(log.error);
