import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import Discord from "discord.js";

dotenv.config();
let app = express();
const client = new Discord.Client();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.TOKEN);

async function getData(req, res, next) {
  let data = await axios.get("https://kontests.net/api/v1/all");
  console.log("Data fetched");
  req.data = data;
  next();
}
client.on("message", (message) => {
  if (message.content === "!ping") {
    // send back "Pong." to the channel the message was sent in
    message.channel.send("Pong.");
  }
});
app.listen(3000, function () {
  console.log("App is Started at Port 3000");
});
