import { getByName } from "../fetch.js";
import { createContestObject, hasWebsite, websites } from "../utils.js";
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
  let data = createContestObject(getByName(name)[0]);
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
  if (!data) {
    message.reply("Not found!!!");
    return;
  }
  message.channel.send({ embed: contestEmbed });
}
export { name, args, description_short, description_long, execute, usage };
