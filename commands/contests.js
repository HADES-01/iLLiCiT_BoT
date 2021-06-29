import { getIn24Hrs, getRunning, getAll, getByWebsite } from "../fetch.js";
import { websites } from "../utils.js";
import storage from "node-persist";
import { MessageButton, MessageActionRow } from "discord-buttons";

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
  let contestEmbed = {
    color: config.color,
    title: "Contests List.",
    fields: [],
  };
  let next = new MessageButton()
    .setID("next_page")
    .setLabel("Next")
    .setStyle("grey")
    .setEmoji("➡");
  let prev = new MessageButton()
    .setID("next_page")
    .setLabel("Previous")
    .setStyle("grey")
    .setEmoji("⬅");
  let row = new MessageActionRow().addComponent(prev).addComponent(next);
  if (!args.length) {
    let data = getAll();
    allData(data, contestEmbed);
    message.channel.send({ embed: contestEmbed, component: row });
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
      allData(data, contestEmbed);
      message.channel.send({ embed: contestEmbed, component: row });
    } else if (args[0].toLowerCase() === "running") {
      let data = getRunning();
      allData(data, contestEmbed);
      message.channel.send({ embed: contestEmbed, component: row });
    } else message.reply("Wrong Usage. Try using `~help contests` for usage.");
  }
}

function allData(data, contestEmbed) {
  data.forEach((ele, idx) => {
    if (idx < maxMessage) {
      contestEmbed.fields.push({
        name: `${ele.name}`,
        value: `Starts in ${ele.hrs_until}hours and ${ele.min_until}minutes\nVisit [here](${ele.url}) for more.`,
      });
    }
  });
}

export { name, description, args, execute };
