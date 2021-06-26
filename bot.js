import express from "express";
import dotenv from "dotenv";
import Discord from "discord.js";
import config from "./config.js";
import fs from "fs";

dotenv.config();
let app = express();
const client = new Discord.Client();
client.commands = new Discord.Collection();

let commFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commFiles) {
  let command = await import(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.TOKEN);

client.on("message", async (message) => {
  let mentioned = message.mentions.users.first();
  if (mentioned && mentioned.username === client.user.username) {
    message.channel.send("Here and Running !!");
    return;
  }
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;
  let args = message.content.slice(1).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  if (!client.commands.has(commandName)) return;
  let command = client.commands.get(commandName);
  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply("there was an error trying to execute that command!");
  }
});

app.listen(3000, function () {
  console.log("App is Started at Port 3000");
});
