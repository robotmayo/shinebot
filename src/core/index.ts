import * as Discord from "discord.js";
import log from "../util/logger";
import wrap from "../util/wrap";
import { Result } from "@robotmayo/result-option";

export type WhenListener = (shinebot: Shinebot) => Promise<Result<any, Error>>;

export default class Shinebot {
  registry: Map<
    string,
    { event: string; plugin: Plugin; listener: WhenListener }[]
  >;
  plugins: Map<string, Plugin>;
  client: Discord.Client;
  token: string;
  constructor(client: Discord.Client, token: string) {
    this.client = client;
    this.token = token;
    this.registry = new Map();
  }

  addPlugin(plugin: Plugin) {
    log.info("Adding plugin", { plugin: plugin.name });
    this.plugins.set(plugin.name, plugin);
  }

  async ready() {
    const pluginsReady = await wrap(
      Promise.all(
        Array.from(this.plugins.values()).map(p =>
          p.ready(this.whenRegistar(p), this)
        )
      )
    );

    if (pluginsReady.isErr()) {
      log.error("error initializing plugin(s)", pluginsReady.unwrapErr());
      try {
        await this.client.destroy();
        log.info("Client destroyed succesfully, exiting");
        process.exit(1);
      } catch (err) {
        log.error("error destroying client", err);
      }
    }

    const events = Array.from(this.registry.keys());
    events.forEach(e => {
      const registered = this.registry.get(e);
      const pluginsListeners = registered.map(r => {
        return { l: r.listener, plugin: r.plugin };
      });
      this.client.on(e, async arg => {
        pluginsListeners.forEach(async pl => {
          const res = await pl.l(this);
          if (res.isErr()) {
            log.error("Error in plugin", { event: e, plugin: pl.plugin.name });
          }
        });
      });
    });
  }

  whenRegistar(
    plugin: Plugin
  ): ((evt: string, whenListener: WhenListener) => void) {
    return function(evt: string, whenListener: WhenListener) {
      let eventList = this.registry.get(event);
      if (!eventList) {
        this.registry.set(event, [{ event, plugin, listener: whenListener }]);
        return;
      }
      eventList.push({ event, plugin, listener: whenListener });
    };
  }

  init() {
    this.client.once("ready", this.ready.bind(this));
    return this.client.login(this.token);
  }
}

export interface Command {
  trigger: string;
  help: string;
  desc: string;
  name: string;
  fn: (message: Discord.Message, shinebot: Shinebot) => Result<void, Error>;
}

export interface Plugin {
  name: string;
  displayName: string;
  desc: string;
  commands: Command[];
  ready: (
    when: (evt: string, whenListener: WhenListener) => void,
    shinebot: Shinebot
  ) => Result<void, Error>;
  [props: string]: any;
}
