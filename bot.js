import express from "express";
import axios from "axios";
import Discord from "discord.js";
let app = express();
const client = new Discord.Client();

console.log("for");

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

async function getData(req, res, next) {
  let data = await axios.get("https://kontests.net/api/v1/all");
  console.log("Data fetched");
  req.data = data;
  next();
}

app.get("/", getData, (req, res) => {
  console.log(req.data["data"][0]);
  res.send("HELLO");
});

app.listen(3000, function () {
  console.log("App is Started at Port 3000");
});
