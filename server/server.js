const express = require("express");
const http = require("http");
const cors = require("cors");
const { userJoin, getUsers, userLeave } = require("./user");

const app = express();
const server = http.createServer(app);
const socketIO = require("socket.io");
const io = socketIO(server);

app.use(cors());

app.get("/", (req, res) => {
  res.send("server");
});

// Global image data
let imageGlobalUrl = null;

io.on("connection", (socket) => {
  socket.on("user-joined", (data) => {
    const { roomId, userName, host, presenter } = data;
    socket.userRoom = roomId;

    const user = userJoin(socket.id, userName, roomId, host, presenter);
    const roomUsers = getUsers(user.room);

    socket.join(user.room);
    socket.emit("message", { message: "Welcome to ChatRoom" });

    // Send whiteboard data if available
    if (imageGlobalUrl) {
      socket.emit("WhiteBoardDataResponse", {
        imageUrl: imageGlobalUrl,
      });
    }

    io.to(user.room).emit("users", roomUsers);
  });

  socket.on("drawing", (data) => {
    console.log("Received drawing data:", data);
    imageGlobalUrl = data;
    socket.broadcast.to(socket.userRoom).emit("canvasImage", data);
  });

  socket.on("disconnect", () => {
    const userLeaves = userLeave(socket.id);
    if (userLeaves) {
      io.to(userLeaves.room).emit("message", {
        message: `${userLeaves.username} left the chat`,
      });
      io.to(userLeaves.room).emit("users", getUsers(userLeaves.room));
    }
  });
});

// Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`server is listening on http://localhost:${PORT}`);
});
