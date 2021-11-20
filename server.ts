import { CARDS } from "./cards.ts";
console.log(CARDS);
const deck = shuffled(CARDS);
let topCard: Set<number>;
let roomSocket: WebSocket;
type Player = {
  socket: WebSocket;
  score: number;
  card: Set<number>;
};
let players: Player[] = [];

const listener = Deno.listen({ port: 8000 });
for await (const conn of listener) {
  await handleConn(conn);
}

async function handleConn(conn: Deno.Conn) {
  const httpConn = Deno.serveHttp(conn);
  for await (const e of httpConn) {
    e.respondWith(handle(e.request));
  }
}

function shuffled<T>(arr: Readonly<Array<T>>): Array<T> {
  return arr
    .map((el: T): [number, T] => [Math.random(), el])
    .sort()
    .map(([_, v]) => v);
}

function serializeCard(card: Set<number>) {
  return JSON.stringify(shuffled([...card]));
}

function handle(req: Request) {
  if (req.headers.get("upgrade") != "websocket") {
    return new Response("not trying to upgrade as websocket.");
  }
  const { socket, response } = Deno.upgradeWebSocket(req);
  socket.onopen = () => {
    const player: Player = { socket: socket, score: 0, card: new Set() };
    console.log("socket opened");
    socket.onmessage = (e) => {
      console.log("got", e.data);
      if (e.data === "start") {
        roomSocket = socket;
        console.log("Setting roomSocket");
        topCard = deck.pop()!;
        roomSocket.send(serializeCard(topCard));
        for (const player of players) {
          if (player.socket !== roomSocket) {
            player.card = deck.pop()!;
            player.socket.send(serializeCard(player.card));
          }
        }
      }
      if (topCard.has(parseInt(e.data, 10))) {
        topCard = player.card;
        roomSocket.send(serializeCard(topCard));
        const newCard = deck.pop();

        for (const player of players) {
          player.socket.send("bling");
        }
        if (newCard) {
          player.card = newCard;
          socket.send(serializeCard(player.card));
        }
      }
    };
    socket.onerror = (e) => {
      console.error(
        "socket errored:",
        e.type,
        e instanceof ErrorEvent ? e.message : ""
      );
      players = players.filter((p) => p.socket !== socket);
      for (const player of players) {
        player.socket.send(JSON.stringify(players.length - 1));
      }
    };
    socket.onclose = () => {
      players = players.filter((p) => p.socket !== socket);
      for (const player of players) {
        player.socket.send(JSON.stringify(players.length - 1));
      }
    };
    players.push(player);
    for (const player of players) {
      player.socket.send(JSON.stringify(players.length - 1));
    }
  };
  return response;
}
