const temp = {
  name: "settings",
  description_long: "Mozzz",
  description_short: "Change certain setttings for the bot",
  args: true,
  usage: "~settings <args>",
  execute(message, args) {
    message.channel.send(`You're argument was **${args[0]}**`);
  },
};

export const {
  name,
  description_long,
  description_short,
  usage,
  args,
  execute,
} = temp;
