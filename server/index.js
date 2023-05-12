const fs = require("node:fs/promises");
const path = require("node:path");
const express = require("express");
const cors = require("cors");
const app = express();
const expressWs = require("express-ws")(app);
const aWss = expressWs.getWss();
const PORT = process.env.PORT || 5050;

// ------------- WebSocket -------------
app.ws("/", (ws, req) => {
  console.log("NEW CONNECTION");
  //   ws.send("Connection created");
  ws.on("message", (msg) => {
    msg = JSON.parse(msg);
    console.log(msg);
    switch (msg.method) {
      case "connect":
        handleConnection(ws, msg);
        break;
      case "message":
        break;
      case "draw":
        broadcastConnection(ws, msg);
        break;
      default:
        break;
    }
  });
});

const handleConnection = (ws, msg) => {
  ws.id = msg.id;
  broadcastConnection(ws, msg);
};

const broadcastConnection = (ws, msg) => {
  aWss.clients.forEach((client) => {
    if (client.id === ws.id) {
      //   client.send(`User ${msg.username} connected`);
      client.send(JSON.stringify(msg));
    }
  });
};

// ------------- REST -------------

app.use(cors());
app.use(express.json());

const canvasImgPrefix = "data:image/png;base64,";

app.get("/image", async (req, res) => {
  try {
    const base64 = await fs.readFile(
      path.resolve(__dirname, "storage", `${req.query.id}.jpg`),
      "base64"
    );
    const dataURL = canvasImgPrefix + base64;
    res.send(dataURL);
  } catch (error) {
    console.log("Error", error.message);
    res.status(500).send("Error");
  }
});

app.post("/image", async (req, res) => {
  try {
    const base64 = req.body.img.replace(canvasImgPrefix, "");
    await fs.writeFile(
      path.resolve(__dirname, "storage", `${req.query.id}.jpg`),
      base64,
      "base64"
    );

    res.status(200).send("OK");
  } catch (error) {
    console.log("Error", error.message);
    res.status(500).send("Error");
  }
});

app.listen(PORT, () => {
  console.log("Opened server on", { PORT });
});
