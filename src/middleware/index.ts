import * as Discord from "discord.js";
import Shinebot from "../core";
//TODO: Build more robust middleware system
async function _m(fns: any[], n: number, ...args: any[]) {
  if (n === fns.length - 1) return await fns[n](...args);
  await fns[n].apply(null, [...args, _m.bind(null, fns, n + 1)]);
}
export default function makeMiddleware(...fns: Function[]) {
  return _m.bind(null, fns, 0);
}

export function isCommand(prefix: string, cmd: string) {
  return function M_isCommand(
    message: Discord.Message,
    shinebot: Shinebot,
    next: Function
  ) {
    if (!message.content.startsWith(prefix)) return;
    message.content === prefix + cmd ? next(message) : 0;
  };
}
