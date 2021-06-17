const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const port = process.env.PORT || 3000;

app.set("views", "./views/index.ejs");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const rooms = {};

app.get("/", (req, res) => {
  res.render("index", { rooms: rooms });
});

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});

const users = {};

io.on("connection", (socket) => {
  socket.on("new-user", (username) => {
    users[socket.id] = username;
    socket.broadcast.emit("user-connected", username);
  });
  socket.on("send-chat-message", (message) => {
    socket.broadcast.emit("chat-message", {
      message: message,
      name: users[socket.id],
    });
  });
  socket.on("disconnect", () => {
    socket.broadcast.emit("user-disconnected", users[socket.id]);
    delete users[socket.id];
  });
});
