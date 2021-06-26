const temp = {
  name: "temp",
  description: "Mozzz",
  args: true,
  usage: "~temp <args>",
  execute(message, args) {
    message.channel.send(`You're argument was **${args[0]}**`);
  },
};

export const { name, description, usage, args, execute } = temp;
