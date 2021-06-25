import express from "express";
import dotenv from "dotenv";
import Discord from "discord.js";
import config from "./config.js";
import getData from "./contestData.js";

dotenv.config();
let app = express();
const client = new Discord.Client();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.TOKEN);

client.on("message", async (message) => {
  if (message.content === `${config.prefix}contests`) {
    let dat = await getData();
    // console.log(dat);
    dat.forEach((ele) => {
      message.channel.send(
        `**${ele.name}** starts in ${ele.hrs} hours and ${ele.min} minutes. Visit here :: ${ele.url}`
      );
    });
  }
});
app.listen(3000, function () {
  console.log("App is Started at Port 3000");
});
