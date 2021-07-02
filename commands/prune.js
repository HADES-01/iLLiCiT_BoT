import storage from "node-persist";
storage.init({ dir: ".node-persist/storage" });
const exp = {
  name: "prune",
  description_short: "Remove certain no. of messages",
  description_long: "Remove certain no. of messages",
  usage: "prune <amount>",
  args: false,
  async execute(message, args) {
    let config = await storage.getItem("config");
    let amount = args.length ? parseInt(args[0]) : config.pruneMessages;
    if (amount < 0 || amount > 99) {
      return message.reply("I can only delete 0-99 messages");
    }
    let deleteEmbed = {
      color: config.color,
      title: `**Deleted ${amount} messages.**`,
    };
    try {
      message.channel.bulkDelete(amount + 1).then(() => {
        message.channel
          .send({ embed: deleteEmbed })
          .then((msg) => msg.delete({ timeout: 3000 }));
      });
    } catch (err) {
      message.reply("I don't have Enough Permissions");
    }
  },
};

export const {
  name,
  description_short,
  description_long,
  args,
  execute,
  usage,
} = exp;
