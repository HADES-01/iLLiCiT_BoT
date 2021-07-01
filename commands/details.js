import { getByName } from "../fetch.js";

let name = "details";
let description = "Ping!";
let args = true;
async function execute(message, args) {
  let name = args.join(" ");
  let data = getByName(name)[0];
  if (!data) {
    message.reply("Not found!!!");
    return;
  }
  message.channel.send(`${data.name} ${data.url}`);
}
export { name, args, description, execute };
