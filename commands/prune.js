const exp = {
  name: "prune",
  description: "Remove certain no. of messages",
  args: true,
  execute(message, args) {
    let amount = parseInt(args[0]);
    message.channel.bulkDelete(amount, true);
  },
};

export const { name, description, args, execute } = exp;
