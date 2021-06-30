import { getIn24Hrs, getRunning, getAll, getByWebsite } from "../fetch.js";
import { websites, row, createContestEmbed } from "../utils.js";
import storage from "node-persist";

const name = "contests",
  description = "Get Contests Info",
  args = false;
let config;
try {
  storage.init({ dir: ".node-persist/storage" });
  config = await storage.getItem("config");
} catch (error) {
  console.error("\x1b[31m==> Couldn't Get Configs\x1b[0m");
}
let maxMessage = config.maxMessages;

async function execute(message, args) {
  if (!args.length) {
    let data = getAll();
    messageHandler(data, message);
  } else {
    args = args.map((ele) => ele.toLowerCase());
    if (args[0] === "website") {
      let web = args[1];
      if (!web) {
        message.reply("Please provide the website name as well.");
        return;
      }
      if (!websites.includes(web)) {
        message.reply(`Sorry I don't have the data for \`${web}\`.`);
        return;
      }
      let data = getByWebsite(web);
      messageHandler(data, message);
    } else if (args[0].toLowerCase() === "running") {
      let data = getRunning();
      messageHandler(data, message);
    } else message.reply("Wrong Usage. Try using `~help contests` for usage.");
  }
}

async function messageHandler(data, message) {
  let next_prev = message.client.next_prev;
  let contestEmbed = {
    color: config.color,
    title: "Contests List.",
    fields: [],
  };
  createContestEmbed(data, contestEmbed, 1, maxMessage);
  await message.channel
    .send({ embed: contestEmbed, component: row })
    .then((message) => {
      next_prev.set(message.id, {
        data: data,
        start: 1,
        curr: 1,
        end: Math.floor(data.length / maxMessage),
      });
    });
}

export { name, description, args, execute };
