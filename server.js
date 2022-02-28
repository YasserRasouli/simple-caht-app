/////////////////////////////////////////////////////////////////////
//BASIC CONFIGURATIONS
/////////////////////////////////////////////////////////////////////

const path = require("path");
const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

const formatMessage = require("./model/message");
const {
  addUser,
  getUser,
  removeUser,
  getUsersOfRoom,
} = require("./model/user");

const { v4: uuidV4 } = require("uuid");
var bodyParser = require("body-parser");

let username;

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

/////////////////////////////////////////////////////////////////////
//ROUTES
/////////////////////////////////////////////////////////////////////
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/:room", (req, res) => {
  res.render("room", { username, roomId: req.params.room });
});

app.post("/api/newroom", (req, res) => {
  username = req.body.name;
  res.redirect(`/${uuidV4()}`);
});

app.post("/api/room", (req, res) => {
  username = req.body.name;
  res.redirect(`/${req.body.roomid}`);
});

io.on("connection", (socket) => {
  console.log("new connection");

  socket.on("join-room", (obj) => {
    const newUser = addUser(socket.id, obj.USERNAME, obj.ROOM_ID);
    socket.join(newUser.room);

    socket.emit(
      "message",
      formatMessage("SYSTEM", `Hello ${newUser.username}, welcome to the room`)
    );

    socket.broadcast
      .to(newUser.room)
      .emit(
        "message",
        formatMessage("SYSTEM", `${newUser.username} has joined the room`)
      );

    io.to(newUser.room).emit("usersOfRoom", {
      room: newUser.room,
      users: getUsersOfRoom(newUser.room),
    });
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage("SYSTEM", `${user.username} has left the room`)
      );

      io.to(user.room).emit("usersOfRoom", {
        room: user.room,
        users: getUsersOfRoom(user.room),
      });
    }
  });

  socket.on("chat-message", (msg) => {
    const user = getUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });
});

server.listen(4000, () => {
  console.log("listening on port 4000");
});

const x = 22;
