let name = "poke";
let description_short = "Poke the bot (*Don't poke too much*)";
let description_long = "Poke the bot (*Don't poke too much*)";
let usage = "poke <no args>";
let args = false;
function execute(message) {
  message.reply("Not Funny. 😑 😑");
}
export { name, args, description_short, description_long, execute, usage };
