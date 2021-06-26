import getData from "../contestData.js";
import Discord from "discord.js";
import config from "../config.js";

const name = "contests",
  description = "Get Contests Info",
  args = false;

async function execute(message, args) {
  let dat = await getData();
  let client = message.client;

  dat.forEach((ele) => {
    if (ele.hrs >= 0) {
      message.channel.send(
        `Starts in ${ele.hrs}hours and ${ele.min}minutes\nVisit here for more:: ${ele.url}`
      );
    }
  });
}

export { name, description, execute };
