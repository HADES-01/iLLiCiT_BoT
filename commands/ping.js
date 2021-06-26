let name = "ping";
let description = "Ping!";
let args = false;
function execute(message) {
  message.channel.send("Pong.");
}
export { name, args, description, execute };
