import getData from "../contestData.js";
import Discord from "discord.js";
import config from "../config.js";

const webhookClient = new Discord.WebhookClient(
  config.webhookID,
  config.webhookTOKEN
);

const embed = new Discord.MessageEmbed()
  .setTitle("**Upcoming Contests**")
  .setColor("#0099ff");

const name = "contests",
  description = "Get Contests Info",
  args = false;

async function execute(message, args) {
  let dat = await getData();
  // let client = message.client;
  // webhookClient.send("", {
  //   username: client.user.username,
  //   avatarURL: `https://cdn.discordapp.com/app-icons/${client.user.id}/${client.user.avatar}.png`,
  //   embeds: [embed],
  // });
  dat.forEach((ele) => {
    if (ele.hrs >= 0) {
      message.channel.send(
        `**${ele.name}**\nStarts in ${ele.hrs}hours and ${ele.min}minutes\nVisit here for more:: ${ele.url}`
      );
    }
  });
}

export { name, description, execute };
