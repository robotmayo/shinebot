import Shinebot, { Plugin, Command, When } from "../core";
import { Ok, Result, None } from "@robotmayo/result-option";
import * as Discord from "discord.js";
import middleware, { isCommand } from "../middleware";
import log from "../util/logger";
import run from "../db";
import * as moment from "moment";

const daily: Command = {
  desc: "Rolls a completely fair die",
  help: "",
  name: "fair-dice-roll",
  trigger: "daily"
};

function lastDaily(userID: string) {
  interface ILastDaily {
    last_daily: Date;
  }
  return run<ILastDaily>(
    `
    SELECT last_daily FROM shinebot.users WHERE id = $1
  `,
    userID
  );
}

async function createUser(userID: string) {
  return run(
    `INSERT INTO shinebot.users
     (id, shines) VALUES ($1, 25)
    `,
    userID
  );
}

async function addShines(userID: string, value: number) {
  return run(
    `UPDATE shinebot.users SET shines = shines + $1 WHERE id = $2`,
    value,
    userID
  );
}

export default class Shines implements Plugin {
  desc = "Rolls a completely fair die";
  displayName = "Shines";
  name = "shines";
  commands = [daily];
  constructor() {}
  ready(when: When, shinebot: Shinebot): Promise<Result<None<void>, Error>> {
    const m = middleware(
      isCommand("$", daily.trigger),
      this.canDaily.bind(this),
      this.doDaily.bind(this)
    );
    when("message", m);
    return Promise.resolve(new Ok(new None()));
  }

  async canDaily(msg: Discord.Message, next: Function) {
    const res = await lastDaily(msg.author.id);
    if (res.isErr()) {
      log.error(
        "error getting users last daily",
        { userID: msg.author.id },
        res.unwrapErr()
      );
      return;
    }

    const ld = res.unwrap();
    if (ld.rows.length === 0) {
      const userResult = await createUser(msg.author.id);
      if (userResult.isErr()) {
        log.error(
          "error adding user to database",
          { userID: msg.author.id },
          userResult.unwrapErr()
        );
        return;
      }
      await this.canDaily(msg, next);
      return;
    }
    const lastDailyMoment = moment(ld.rows[0].last_daily);
    const diff = moment.duration(moment().diff(lastDailyMoment));
    if (diff.asHours() < 24) {
      await msg.reply(
        `Already consumed your daily. Try again in ${Math.ceil(
          24 - diff.asHours()
        )} hours`
      );
      return;
    }
    next(msg);
  }

  async doDaily(m: Discord.Message) {
    const res = await addShines(m.author.id, 3);
    if (res.isErr()) {
      log.error("Error adding shines", res.unwrapErr());
      return;
    }
    await m.reply("Added 3 shines!");
    const ld = await run(
      `UPDATE shinebot.users SET last_daily = $1 WHERE id = $2`,
      new Date(),
      m.author.id
    );
    if (ld.isErr()) {
      log.error("error updating users daily timer", { user: m.author.id });
    }
  }
}
