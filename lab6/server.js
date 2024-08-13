const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static("public"));

let users = {};

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("set username", (username) => {
    users[socket.id] = username;
    io.emit("user connected", username);
  });

  socket.on("chat message", (msg) => {
    io.emit("chat message", { user: users[socket.id], msg });
  });

  socket.on("disconnect", () => {
    io.emit("user disconnected", users[socket.id]);
    delete users[socket.id];
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
