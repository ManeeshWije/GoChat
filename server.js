const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const port = process.env.PORT || 3000;

// app.set("views", __dirname + "/views");
// app.use(express.urlencoded({ extended: true }));

app.get("/views/index.html", (req, res) => {
  console.log("yea");
  res.redirect("/views/index.html");
  app.use(express.static(__dirname + "/public"));
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
