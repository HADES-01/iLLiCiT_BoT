import { getIn24Hrs, getRunning, getAll, getByWebsite } from "../fetch.js";
import storage from "node-persist";

storage.init({ dir: ".node-persist/storage" });
const name = "contests",
  description = "Get Contests Info",
  args = false;

async function execute(message, args) {
  let client = message.client;
  let config = await storage.getItem("config");
  let maxMessage = config.maxMessages;
  let contestEmbed = {
    color: config.color,
    title: "Contests List.",
    fields: [],
  };
  if (!args.length) {
    let data = getAll();
    data.forEach((ele, idx) => {
      if (idx < maxMessage) {
        contestEmbed.fields.push({
          name: `${ele.name}`,
          value: `Starts in ${ele.hrs_until}hours and ${ele.min_until}minutes\nVisit [here](${ele.url}) for more.`,
        });
      }
    });
    message.channel.send({ embed: contestEmbed });
    console.log(contestEmbed);
  } else if (args.length > 1) {
    if (args[0] === "website") {
      let web = args[1];
      let data = getByWebsite(web);
      data.forEach((ele, idx) => {
        if (idx < maxMessage) {
          contestEmbed.fields.push({
            name: `${ele.name}`,
            value: `Starts in ${ele.hrs_until}hours and ${ele.min_until}minutes\nVisit [here](${ele.url}) for more.`,
          });
        }
      });
      message.channel.send({ embed: contestEmbed });
    } else {
      message.channel.send("Too many arguments");
    }
  } else {
    if (args[0].toLowerCase() === "running") {
      let data = getRunning();
      data.forEach((ele) => {
        message.channel.send(
          `Starts in ${ele.hrs_until}hours and ${ele.min_until}minutes\nVisit [here](${ele.url}) for more.`
        );
      });
    } else {
      message.channel.send("Provide valid arguments");
    }
  }
}

export { name, description, args, execute };
