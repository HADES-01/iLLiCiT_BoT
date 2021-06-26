import express from "express";
import dotenv from "dotenv";
import Discord from "discord.js";
import config from "./config.js";
import getData from "./contestData.js";

dotenv.config();
let app = express();
const client = new Discord.Client();

let contestData = [];

// contestData = await getData();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.TOKEN);

const webhookClient = new Discord.WebhookClient(
  config.webhookID,
  config.webhookTOKEN
);

const embed = new Discord.MessageEmbed()
  .setTitle("**Upcoming Contests**")
  .setColor("#0099ff");

client.on("message", (message) => {
  if (message.author.bot) return;
  webhookClient.send("", {
    username: client.user.username,
    avatarURL: `https://cdn.discordapp.com/app-icons/${client.user.id}/${client.user.avatar}.png`,
    embeds: [embed],
  });
});
// client.on("message", async (message) => {
//   if (!message.content.startsWith(config.prefix) || message.author.bot) return;
//   let args = message.content.slice(1).trim().split(/ +/);
//   const command = args.shift().toLowerCase();
//   if (command === "ping") {
//     message.channel.send("Pong");
//   } else if (command === "contests") {
//     let dat = await getData();
//     dat.forEach((ele) => {
//       if (ele.hrs >= 0) {
//         message.channel.send(
//           `**${ele.name}**\nStarts in ${ele.hrs}hours and ${ele.min}minutes\nVisit here for more:: ${ele.url}`
//         );
//       }
//     });
//   } else {
//     message.channel.send("Command not Recognized !!!");
//   }
// });

app.listen(3000, function () {
  console.log("App is Started at Port 3000");
});
