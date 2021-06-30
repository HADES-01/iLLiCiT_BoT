// import express from "express";
import dotenv from "dotenv";
import Discord from "discord.js";
import config, { prefix } from "./config.js";
import storage from "node-persist";
import fs from "fs";
import { everyHour, seed } from "./fetch.js";
import disbut from "discord-buttons";
import { createContestEmbed } from "./utils.js";

// let app = express();
const client = new Discord.Client();
disbut(client);
dotenv.config();
storage.init({ dir: ".node-persist/storage" }).catch((err) => {
  console.log("\x1b[31m==> Unable to Setup LocalStorage\x1b[0m");
});
client.commands = new Discord.Collection();
client.next_prev = new Discord.Collection();

const webhookClient = new Discord.WebhookClient(
  config.webhookID,
  config.webhookTOKEN
);

let commFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commFiles) {
  try {
    let command = await import(`./commands/${file}`);
    client.commands.set(command.name, command);
  } catch (err) {
    console.log("\x1b[31m==> Couldn't load files\x1b[0m");
  }
}

client.on("ready", async () => {
  console.log(`\x1b[33mLogged in as ${client.user.tag}!\x1b[0m`);
  try {
    let configs = await storage.getItem("config");
    if (!configs) {
      console.log("\x1b[36m==> Setting Basic Configs\x1b[0m");
      configs = config;
      await storage.setItem("config", configs);
    } else {
      console.log("\x1b[35m==> Using cached configs\x1b[0m");
    }
    await seed();
  } catch (err) {
    console.log("\x1b[31m==> Unable to Seed database\x1b[0m");
  }
  setInterval(async () => {
    try {
      let temp = await everyHour();
      client.emit("contestUpdate", temp);
    } catch (err) {
      console.log("\x1b[31m==> Unable to Update Database\x1b[0m");
    }
  }, 3600000);
});

client.on("clickButton", async (button) => {
  let contestEmbed = await button.message.embeds[0];
  let buttons = await button.message.components[0];
  let message_info = await client.next_prev.get(button.message.id);
  let { data, curr } = message_info;
  if (button.id === "next_page") {
    console.log(curr);
    createContestEmbed(data, contestEmbed, curr + 1, config.maxMessages);
    message_info.curr += 1;
    await client.next_prev.set(button.message.id, message_info);
  }
  await button.message.edit({ embed: contestEmbed, component: buttons });
  button.defer();
});

client.on("contestUpdate", (dat) => {
  if (!dat.length) return;
  const exampleEmbed = { title: `${dat[0].name}` };
  webhookClient.send("", {
    username: client.user.username,
    avatarURL: `https://cdn.discordapp.com/app-icons/${client.user.id}/${client.user.avatar}.png`,
    embeds: [exampleEmbed],
  });
});

client.on("message", async (message) => {
  let mentioned = message.mentions.users.first();
  if (mentioned && mentioned.username === client.user.username) {
    message.reply("Thanks for checking in. 😇 😇");
    return;
  }
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;
  let args = message.content.slice(1).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  if (!client.commands.has(commandName)) {
    message.reply(
      `\`${commandName}\` is not one of my commands. Try Listing all Commands using \`${prefix}help\``
    );
    return;
  }
  let command = client.commands.get(commandName);
  try {
    if (command.args && !args.length) {
      message.reply(`I can't work like this.\n Give me some Args`);
      return;
    }
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply("there was an error trying to execute that command!");
  }
});

client.login(process.env.TOKEN);

// app.listen(3000, function () {
//   console.log("App is Started at Port 3000");
// });
