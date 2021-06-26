const a = {
  name: "temp",
  description: "Mozzz",
  args: true,
  execute(message, args) {
    message.channel.send(`You're argument was **${args[0]}**`);
  },
};

export const { name, description, args, execute } = a;
