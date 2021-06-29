import storage from "node-persist";
storage.init({ dir: ".node-persist/storage" });
const exp = {
  name: "prune",
  description: "Remove certain no. of messages",
  args: false,
  async execute(message, args) {
    let config = await storage.getItem("config");
    let amount = args.length ? parseInt(args[0]) : config.pruneMessages;
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

export const { name, description, args, execute } = exp;
