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

const roomHistory = {};
const messageHistory = {}; // Message storage added

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Moved message handler inside connection but outside user-joined
  socket.on("message", (msg) => {
    if (!socket.userRoom) return;
    
    // Store message
    if (!messageHistory[socket.userRoom]) {
      messageHistory[socket.userRoom] = [];
    }
    messageHistory[socket.userRoom].push(msg);

    // Broadcast to room
    io.to(socket.userRoom).emit("messageResponse", msg);
  });

  socket.on("user-joined", (data) => {
    const { roomId, userName, host, presenter } = data;
    socket.userRoom = roomId;

    const user = userJoin(socket.id, userName, roomId, host, presenter);
    const roomUsers = getUsers(user.room);

    socket.join(user.room);

    // Send chat history when joining
    if (messageHistory[roomId]) {
      socket.emit("messageHistory", messageHistory[roomId]);
    }

    // Corrected user update event
    io.to(user.room).emit("newUserResponse", roomUsers);

    // Original drawing history code remains
    if (roomHistory[roomId]) {
      socket.emit("drawing_history", roomHistory[roomId]);
    }
  });

  // Rest of the original code remains unchanged
  socket.on("drawing", (data) => {
    if (!socket.userRoom) return;

    if (!roomHistory[socket.userRoom]) {
      roomHistory[socket.userRoom] = [];
    }
    roomHistory[socket.userRoom].push(data);

    socket.broadcast.to(socket.userRoom).emit("canvasImage", data);
  });

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    socket.userRoom = roomId;

    if (roomHistory[roomId]) {
      socket.emit("drawing_history", roomHistory[roomId]);
    }
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

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`server is listening on http://localhost:${PORT}`);
});
