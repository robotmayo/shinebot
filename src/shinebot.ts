import * as discord from "discord.js";
import run from "./db";
import { Err } from "@robotmayo/result-option";
export enum STRINGS {
  PREFIX = "$",
  DAILY = "daily"
}

export default class Shinebot {
  constructor(public discordJSClient: discord.Client) {}

  async getLastDailyFromUser(userID: string) {
    interface getLastDailyFromUser {
      last_daily: Date;
    }
    const res = await run<getLastDailyFromUser>(
      getLastDailyFromUserQuery,
      userID
    );
    if (res.isErr()) return res;
    const rows = res.unwrap();
    if (rows.rows.length === 0) return new Err(new Error("User not fo"));
  }

  async handleDaily(userID: string) {}

  handleMessage(message: discord.Message) {
    if (message.content == STRINGS.PREFIX + STRINGS.DAILY) {
      return this.handleDaily(message.author.id);
    }
  }
}

export const getLastDailyFromUserQuery = `
SELECT last_daily FROM shinebot.users WHERE id = ?
`;
