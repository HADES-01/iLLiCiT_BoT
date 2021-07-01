import { getByName } from "../fetch.js";
import storage from "node-persist";

let name = "details";
let description = "Ping!";
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
export { name, args, description, execute };
