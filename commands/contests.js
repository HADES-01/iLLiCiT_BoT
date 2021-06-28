import { getIn24Hrs, getRunning, getAll, getByWebsite } from "../fetch.js";

const name = "contests",
  description = "Get Contests Info",
  args = false;

async function execute(message, args) {
  let client = message.client;
  if (!args.length) {
    let data = getAll();
    data.forEach((ele) => {
      message.channel.send(
        `Starts in ${ele.hrs_until}hours and ${ele.min_until}minutes\nVisit here for more:: ${ele.url}`
      );
    });
  } else if (args.length > 1) {
    if (args[0] === "website") {
      let web = args[1];
      let data = getByWebsite(web);
      data.forEach((ele) => {
        message.channel.send(
          `**${ele.name}**\nStarts in ${ele.hrs_until}hours and ${ele.min_until}minutes\nVisit here for more:: ${ele.url}`
        );
      });
    } else {
      message.channel.send("Too many arguments");
    }
  } else {
    if (args[0].toLowerCase() === "running") {
      let data = getRunning();
      data.forEach((ele) => {
        message.channel.send(
          `Starts in ${ele.hrs_until}hours and ${ele.min_until}minutes\nVisit here for more:: ${ele.url}`
        );
      });
    } else {
      message.channel.send("Provide valid arguments");
    }
  }
}

export { name, description, args, execute };
