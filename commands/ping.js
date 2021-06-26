let name = "ping";
let description = "Ping!";
function execute(message, args) {
  message.channel.send("Pong.");
}
export { name, description, execute };
