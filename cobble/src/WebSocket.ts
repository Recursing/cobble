const protocol = window.location.hostname === "localhost" ? "ws" : "wss";
const ws = new WebSocket(`${protocol}://${window.location.hostname}:8123`);
export const subscribers: CallableFunction[] = [];
export function send(data: string) {
  ws.send(data);
}
ws.onmessage = (message) => {
  console.log(message.data);
  subscribers.forEach((s) => s(message));
};
