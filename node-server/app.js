// env config
import "./config.js";

import express from "express";
import http from "http";
import { Server } from "socket.io";
import multer from "multer";
import cors from "cors";
import path from "path";

// DBs
import "./models/mongodb.js";
import "./models/postgres.js";

// controllers
import roomControllers from "./controllers/roomController.js";
import userControllers from "./controllers/userController.js";
import chatControllers from "./controllers/chatController.js";

// get __dirname in ES module scope
import { fileURLToPath } from "url";
import { joinRoom, sendMessage } from "./services/chatService.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Middleware to handle URL-encoded form data
// serve statis file
app.use("/rooms", express.static(path.join(__dirname, "./static/rooms")));
app.use("/users", express.static(path.join(__dirname, "./static/users")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = path.join(__dirname, "./static/");
    if (file.fieldname === "avatar") {
      uploadPath = path.join(__dirname, "./static/users");
    } else if (file.fieldname === "picture") {
      uploadPath = path.join(__dirname, "./static/rooms");
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});
const upload = multer({
  storage: storage,
});

// WebSocket
// https://socket.io/docs/v3/emitting-events/
/*
  WebSocket: client side and server side communication
  to have server to server communication, use Kafka
*/
io.on("connection", (socket) => {
  console.log("A user connected: ", socket.id);
  /*
    socket object represents the connection between the server and 
    a specific event.
    Each client that connects to the server gets a unique `socket` object
  */
  socket.on("joinRoom", async (data) => {
    const { roomId, message } = joinRoom(data);

    await socket.join(roomId);

    // Debug purpose
    // const clients = await io.in(roomId).allSockets();
    // console.log(`SOCKET_JOIN_ROOM_CLIENTS ${roomId}: `, clients);

    // when emitting event, client side will receive the message
    socket.to(roomId).emit("message", message);
  });

  socket.on("message", async (data) => {
    const { roomId, message } = await sendMessage(data);

    // Debugging statement to check room membership
    // const clients = await io.in(roomId).allSockets();
    // console.log(`SOCKET_MESSAGE_EVENTS ${roomId}:`, clients);

    io.to(roomId).emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log("CLIENT_DISCONNECTED: ", socket.id);
  });
});

app.use("/rooms/create-room", upload.single("picture"));
app.use("/users/create-user", upload.single("avatar"));

app.use("/rooms", roomControllers);
app.use("/users", userControllers);
app.use("/chats", chatControllers);

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
