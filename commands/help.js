import { prefix } from "../config.js";

const help = {
  name: "help",
  desciption: "Provides info on all available commands",
  execute(message, args) {
    const data = [];
    const { commands } = message.client;
    if (!args.length) {
      data.push("Here's a list of all my commands:");
      data.push(
        "`" + commands.map((command) => command.name).join("`, `") + "`"
      );
      data.push(
        `\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`
      );
    } else {
      args.map((arg) => data.push(helpCommand(arg, commands)));
    }
    return message.author
      .send(data, { split: true })
      .then(() => {
        if (message.channel.type === "dm") return;
        message.reply("I've sent you a DM with all my commands!");
      })
      .catch((error) => {
        console.error(
          `Could not send help DM to ${message.author.tag}.\n`,
          error
        );
        message.reply(
          "it seems like I can't DM you! Do you have DMs disabled?"
        );
      });
  },
};

function helpCommand(name, commands) {
  let resp = "";
  resp += `\`${name}\` command`;
  resp += `\n*Usage* ${commands.find((comm) => comm.name === name).usage}`;
  return resp;
}

export const { name, desciption, execute, args } = help;