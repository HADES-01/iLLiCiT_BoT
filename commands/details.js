import { getByName } from "../fetch.js";
import storage from "node-persist";

let name = "details";
let description_short = "Gets details for certain contests by name.";
let description_long = "Gets details for certain contests by name.";
let usage = `details <contest name>`;
let args = true;
async function execute(message, args) {
  let config;
  try {
    storage.init({ dir: ".node-persist/storage" });
    config = (await storage.getItem("config")) || configs;
  } catch (error) {
    console.error("\x1b[31m==> Couldn't Get Configs\x1b[0m");
  }
  let name = args.join(" ");
  let data = getByName(name)[0];
  let contestEmbed = {
    color: config.color,
    title: data.name,
    fields: [],
  };
  if (!data) {
    message.reply("Not found!!!");
    return;
  }
  message.channel.send({ embed: contestEmbed });
}
export { name, args, description_short, description_long, execute, usage };
