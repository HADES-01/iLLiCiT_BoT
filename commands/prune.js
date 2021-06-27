const exp = {
  name: "prune",
  description: "Remove certain no. of messages",
  args: true,
  execute(message, args) {
    let mess = parseInt(args[0]);
    message.channel.bulkDelete(mess, true);
  },
};

export const { name, description, args, execute } = exp;
