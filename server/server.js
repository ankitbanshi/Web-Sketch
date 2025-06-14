const express = require("express");
const http = require("http");
const cors = require("cors");
const { userJoin, getUsers, userLeave,getCurrentUser } = require("./user");

const app = express();
const server = http.createServer(app);
const socketIO = require("socket.io");
const io = socketIO(server);
// serve on port
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});


// socket.io
let imageUrl, userRoom;
io.on("connection", (socket) => {
  socket.on("user-joined", (data) => {
    const { roomId, userId, userName, host, presenter } = data;
    userRoom = roomId;
    const user = userJoin(socket.id, userName, roomId, host, presenter);
    const roomUsers = getUsers(user.room);
    socket.join(user.room);
    socket.emit("message", {
      message: "Welcome to ChatRoom",
    });
    socket.broadcast.to(user.room).emit("message", {
      message: `${user.username} has joined`,
    });
    

    io.to(user.room).emit("users", roomUsers);
    io.to(user.room).emit("canvasImage", imageUrl);
  }
);
  
 socket.on("sendMessage", (message) => {
  const user = getCurrentUser(socket.id);
  console.log("Received message from:", user, "Message:", message); // <--- THIS LOG
  if (user) {
    io.to(user.room).emit("chatMessage", {
      user: user.username,
      text: message,
      time: new Date().toISOString()
    });
  }
});

  socket.on("drawing", (data) => {
  const user = getCurrentUser(socket.id);
  if (user) {
    imageUrl = data;
    socket.broadcast.to(user.room).emit("canvasImage", imageUrl);
  }
});

  socket.on("disconnect", () => {
  const userLeaves = userLeave(socket.id);
  if (userLeaves) {
    const roomUsers = getUsers(userLeaves.room);
    io.to(userLeaves.room).emit("message", {
      message: `${userLeaves.username} left the chat`,
    });
    io.to(userLeaves.room).emit("users", roomUsers);
  }
});
});
app.get("/", (req, res) => {
  res.send("server is up and running");
});




server.listen(PORT, () =>
  console.log(`server is listening on http://localhost:${PORT}`)
);