import { getIn24Hrs, getRunning, getAll, getByWebsite } from "../fetch.js";
import { websites, newRow, createContestEmbed } from "../utils.js";
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
    messageHandler(data, message, { id: 1 });
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
      messageHandler(data, message, { id: 3, website: web });
    } else if (args[0].toLowerCase() === "running") {
      let data = getRunning();
      messageHandler(data, message, { id: 2 });
    } else message.reply("Wrong Usage. Try using `~help contests` for usage.");
  }
}

async function messageHandler(data, message, type) {
  let embedTitle;
  switch (type.id) {
    case 1:
      embedTitle = "All contests";
      break;
    case 2:
      embedTitle = "All Running Contests";
      break;
    case 3:
      embedTitle = `All Contests From ${type.website.toUpperCase()}`;
      break;
  }
  let next_prev = message.client.next_prev;
  let contestEmbed = {
    color: config.color,
    title: embedTitle,
    fields: [],
  };
  createContestEmbed(data, contestEmbed, 1, maxMessage);
  let row = newRow();
  row.components[0].setDisabled();
  let len = data.length;
  let total = Math.floor(len / maxMessage) + (len % maxMessage === 0 ? 0 : 1);
  total === 1 && (await row.components[1].setDisabled());
  await message.channel
    .send({ embed: contestEmbed, component: row })
    .then((message) => {
      next_prev.set(message.id, {
        timestamp: new Date().getMilliseconds(),
        data: data,
        start: 1,
        curr: 1,
        end: total,
      });
    });
}

export { name, description, args, execute };
