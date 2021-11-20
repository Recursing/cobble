const protocol = window.location.hostname === "localhost" ? "ws" : "wss";
const ws = new WebSocket(`${protocol}://${window.location.hostname}:8000`);
const onOpenQueue: CallableFunction[] = [];
export const subscribers: CallableFunction[] = [];
export function send(data: string) {
  try {
    ws.send(data);
  } catch {
    onOpenQueue.push(() => ws.send(data));
  }
}
ws.onmessage = (message) => {
  console.log(message.data);
  subscribers.forEach((s) => s(message));
};

ws.onopen = () => onOpenQueue.map((f) => f());
