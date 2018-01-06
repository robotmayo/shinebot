import Shinebot, { Plugin, Command, When } from "../core";
import { Ok, Result, None } from "@robotmayo/result-option";
import * as Discord from "discord.js";
import middleware, { isCommand } from "../middleware";
import log from "../util/logger";

const fdr: Command = {
  desc: "Rolls a completely fair die",
  help: "",
  name: "fair-dice-roll",
  trigger: "roll"
};
export default class FairDiceRoll implements Plugin {
  desc = "Rolls a completely fair die";
  displayName = "Fair Die Roll";
  name = "fair-dice-roll";
  commands = [fdr];
  constructor() {}
  ready(when: When, shinebot: Shinebot): Promise<Result<None<void>, Error>> {
    const m = middleware(isCommand("!", fdr.trigger), this.rollDie);
    when("message", m);
    return Promise.resolve(new Ok(new None()));
  }
  async rollDie(m: Discord.Message) {
    await m.reply("4");
  }
}
