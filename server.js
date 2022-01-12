const express = require("express");
const ip = require("ip");
const { Server } = require("ws");

const app = express();

/** HTTP サーバの作成 */
const PORT = 50000;
const INDEX = "/index.html";

const server = app
  // .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .use(express.static(__dirname))
  .listen(PORT, () => console.log(`http://${ip.address()}:${PORT}`));

/** WebSocket サーバの作成 */
const wss = new Server({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (msg) => {
    console.log(`Received : ${msg}`);

    wss.clients.forEach((client) => client.send(msg.toString()));
  });

  ws.on("close", () => console.log("Client disconnected"));
});
