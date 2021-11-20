import { CARDS } from "./cards.ts";
console.log(CARDS);
const deck = shuffled(CARDS);
let topCard: Set<number>;
type Player = {
  socket: WebSocket;
  score: number;
  card?: Set<number>;
};
let players: Player[] = [];
let rooms: WebSocket[] = [];

const USE_TLS = await Deno.realPath(".").then((path) =>
  path.includes("/var/www")
);

const listener = USE_TLS
  ? Deno.listenTls({
      port: 8000,
      certFile: "cert.pem",
      keyFile: "privkey.pem",
    })
  : Deno.listen({ port: 8000 });

for await (const conn of listener) {
  await handleConn(conn);
}

async function handleConn(conn: Deno.Conn) {
  const httpConn = Deno.serveHttp(conn);
  while (true) {
    try {
      const requestEvent = await httpConn.nextRequest();
      if (requestEvent === null) {
        console.error({ requestEvent });
        return;
      }
      requestEvent.respondWith(handle(requestEvent.request));
    } catch (error) {
      console.error(error);
    }
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
    const player: Player = { socket: socket, score: 0 };
    console.log("socket opened");
    socket.onmessage = (e) => {
      console.log("got", e.data);
      if (e.data === "addPlayer") {
        if (topCard != null) {
          player.card = deck.pop()!;
          socket.send(serializeCard(player.card));
        }
        players.push(player);
      } else if (e.data === "addRoom") {
        rooms.push(socket);
        if (topCard != null) {
          socket.send(serializeCard(topCard));
        }
      } else if (e.data === "start") {
        console.log("Setting roomSocket");
        topCard = deck.pop()!;
        rooms.forEach((room) => room.send(serializeCard(topCard)));
        for (const player of players) {
          player.card = deck.pop()!;
          player.socket.send(serializeCard(player.card));
        }
      } else if (topCard && topCard.has(parseInt(e.data, 10)) && player.card) {
        topCard = player.card;
        rooms.forEach((room) => room.send(serializeCard(topCard)));
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
      rooms = rooms.filter((r) => r !== socket);
      for (const player of players) {
        player.socket.send(JSON.stringify(players.length - 1));
      }
    };
    socket.onclose = () => {
      players = players.filter((p) => p.socket !== socket);
      rooms = rooms.filter((r) => r !== socket);
      for (const player of players) {
        player.socket.send(JSON.stringify(players.length - 1));
      }
    };
    for (const player of players) {
      player.socket.send(JSON.stringify(players.length - 1));
    }
  };
  return response;
}
