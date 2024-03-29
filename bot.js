import express from "express";
import dotenv from "dotenv";
import Discord from "discord.js";
import config, { prefix } from "./config.js";
import storage from "node-persist";
import fs from "fs";
import { everyHour, seed } from "./fetch.js";
import disbut from "discord-buttons";
import {
  createContestEmbed,
  newRow,
  createContestObject,
  hasWebsite,
} from "./utils.js";

let app = express();
const client = new Discord.Client();
disbut(client);
dotenv.config();
storage.init({ dir: ".node-persist/storage" }).catch((err) => {
  console.log("\x1b[31m==> Unable to Setup LocalStorage\x1b[0m");
});
client.commands = new Discord.Collection();
client.next_prev = new Discord.Collection();
client.on("ready", ready);
client.on("clickButton", clickButton);
client.on("contestUpdate", contestUpdate);
client.on("message", onMessage);
client.on("guildCreate", newGuild);
client.login(process.env.TOKEN);

let commFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commFiles) {
  try {
    let command = await import(`./commands/${file}`);
    client.commands.set(command.name, command);
  } catch (err) {
    console.log("\x1b[31m==> Couldn't load files\x1b[0m", err);
  }
}

async function handleEveryHour() {
  try {
    let temp = await everyHour();
    client.emit("contestUpdate", temp);
    let curr = new Date();
    client.next_prev.sweep(
      (ele) => curr.getMilliseconds() - ele.timestamp > 86400000
    );
  } catch (err) {
    console.log("\x1b[31m==> Unable to Update Database\x1b[0m", err);
  }
}

async function ready() {
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
  await handleEveryHour();
  setInterval(handleEveryHour, 20000);
}

async function clickButton(button) {
  let contestEmbed = await button.message.embeds[0];
  delete button.message.component;
  let buttons = newRow();
  try {
    let message_info = await client.next_prev.get(button.message.id);
    let { data, curr, start, end } = message_info;
    if (button.id === "next_page") {
      createContestEmbed(data, contestEmbed, curr + 1, config.maxMessages);
      message_info.curr += 1;
      await client.next_prev.set(button.message.id, message_info);
      if (curr + 1 === end) {
        buttons.components[1].setDisabled();
      }
    } else if (button.id === "prev_page") {
      createContestEmbed(data, contestEmbed, curr - 1, config.maxMessages);
      message_info.curr -= 1;
      await client.next_prev.set(button.message.id, message_info);
      if (curr - 1 === start) {
        buttons.components[0].setDisabled();
      }
    }
    await button.message.edit({ embed: contestEmbed, component: buttons });
    button.defer();
  } catch (err) {
    contestEmbed.title = "List is Too Old.";
    delete contestEmbed.fields;
    delete contestEmbed.footer;
    console.log("\x1b[31m==> List not found in Collections\x1b[0m");
    button.message.edit({ embed: contestEmbed });
    button.defer();
    return;
  }
}

function contestUpdate(dat) {
  config.webhooks.forEach((hook) => {
    const webhookClient = new Discord.WebhookClient(hook.ID, hook.TOKEN);
    if (!dat) return;
    dat.forEach((ele) => {
      let data = createContestObject(ele);
      let website = hasWebsite(data.website.split(" ").join(""));
      let contestEmbed = {
        color: config.color,
        title: data.name,
        description: website.description,
        thumbnail: {
          url: website.url,
        },
        fields: [
          {
            name: "Start Time",
            value: `${data.start_date}/${data.start_month}/${data.start_year} at ${data.start_time}`,
            inline: true,
          },
          {
            name: "End Time",
            value: `${data.end_date}/${data.end_month}/${data.end_year} at ${data.end_time}`,
            inline: true,
          },
          {
            name: "Duration",
            value: `${data.duration_hrs} hours and ${data.duration_min} minutes`,
            inline: false,
          },
        ],
        timestamp: new Date(),
      };
      webhookClient.send("", {
        username: client.user.username,
        avatarURL: `https://cdn.discordapp.com/app-icons/${client.user.id}/${client.user.avatar}.png`,
        embeds: [contestEmbed],
      });
    });
  });
}

async function onMessage(message) {
  let mentioned = message.mentions.users.first();
  if (mentioned && mentioned.username === client.user.username) {
    message.reply(
      `Thanks for checking in. 😇 😇\nGet my commands by \`${prefix}help\``
    );
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
    await command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply("there was an error trying to execute that command!");
  }
}

function newGuild(guild) {
  guild.config = config;
}

app.get("/", (req, resp) => {
  resp.redirect(
    "https://discord.com/api/oauth2/authorize?client_id=857700122515472424&permissions=8&scope=bot"
  );
});

app.listen(process.env.PORT || 3000, function () {
  console.log("App is Started at Port 3000");
});
