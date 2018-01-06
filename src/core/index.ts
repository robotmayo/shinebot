import * as Discord from "discord.js";
import log from "../util/logger";
import wrap from "../util/wrap";
import { Result } from "@robotmayo/result-option";

export type WhenListener = (arg: any, shinebot: Shinebot) => Promise<any>;
export type When = (evt: string, whenListener: WhenListener) => void;

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
    this.plugins = new Map();
  }

  addPlugin(plugin: Plugin) {
    log.info("Adding plugin", { plugin: plugin.name });
    this.plugins.set(plugin.name, plugin);
  }

  async ready() {
    log.info("Ready, starting plugins");
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
      this.client.on(e, async (arg: any) => {
        pluginsListeners.forEach(async pl => {
          try {
            await pl.l(arg, this);
          } catch (err) {
            log.error("Error in plugin", {
              event: e,
              plugin: pl.plugin.name,
              err
            });
          }
        });
      });
    });
    log.info("Initialization complete");
  }

  whenRegistar(
    plugin: Plugin
  ): ((evt: string, whenListener: WhenListener) => void) {
    return (event: string, whenListener: WhenListener) => {
      let eventList = this.registry.get(event);
      if (!eventList) {
        this.registry.set(event, [{ event, plugin, listener: whenListener }]);
        return;
      }
      eventList.push({ event, plugin, listener: whenListener });
    };
  }

  init() {
    log.info("Logging in");
    this.client.once("ready", this.ready.bind(this));
    return this.client.login(this.token);
  }
}

export interface Command {
  trigger: string;
  help: string;
  desc: string;
  name: string;
}

export interface Plugin {
  name: string;
  displayName: string;
  desc: string;
  commands: Command[];
  ready: (when: When, shinebot: Shinebot) => Promise<Result<any, Error>>;
  [props: string]: any;
}
