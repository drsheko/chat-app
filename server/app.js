require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var session = require("express-session");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var User = require("./models/userModel");
var Routers = require("./routes/routers");
var bcrypt = require("bcryptjs");
var cors = require("cors");
const multer = require("multer");
const { Server } = require("socket.io");
const { createServer } = require("http");
const { ExpressPeerServer } = require("peer");

// mongoDatabase setup
mongoDB =
  "mongodb+srv://drsheko:" +
  process.env.MONGO_PASSCODE +
  "@chat-app.yyqnnrf.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Mongo Connection Error"));

var app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: "*" });

// multer
const memoStorage = multer.memoryStorage();
const upload = multer({ memoStorage });

//PEER SERVER
const peerServer = ExpressPeerServer(httpServer, {
  debug: true,
});

app.use("/peerjs", peerServer);

peerServer.on("connection", (client) => {
});
peerServer.on("disconnect", (client) => {
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// passport setup
passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { error: "User is not found " });
      }

      bcrypt.compare(password, user.password, (err, res) => {
        if (err) {
          return done();
        }
        if (!res) {
          return done(null, false, { error: "Incorrect password" });
        } else {
          return done(null, user);
        }
      });
    });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

app.use(cors());
app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  res.setHeader("Access-Control-Allow-Credentials", true);

  next();
});

// Routes setup
app.use("/", Routers);

//SOCKET IO
io.on("connection", (socket) => {
  const id = socket.handshake.query.id;
  var myrooms = [];
  socket.emit("connected", id);
  socket.on("join", (chat) => {
    var chatId = chat._id;
    socket.join(chatId);
  });
  socket.on("join rooms", (data) => {
    var roomsIds = data.map((r) => r._id);
    myrooms = roomsIds;
    roomsIds.map((r) => {
      socket.join(r);
      io.in(r).emit("online", { id });
    });
  });

  socket.on("chat message", (data) => {
    io.in(data.room).emit("message", {
      message: data.message,
      postedBy: data.sender,
      chatRoom: data.room,
      type: data.type,
    });
  });
  // photo message
  socket.on("chat photo message", (data) => {
    io.in(data.newMessage.chatRoom).emit("photo message", {
      msg: data.newMessage,
    });
  });

  // voice message
  socket.on("chat voice message", (data) => {
    io.in(data.newMessage.chatRoom).emit("voice message", {
      msg: data.newMessage,
    });
  });
  socket.on("cancel call", (data) => {
    io.in(data.room).emit("cancel call request", { data });
  });

  socket.on("decline call", (data) => {
    io.in(data.room).emit("decline call request", { data });
  });
  socket.on("end call", (data) => {
    io.in(data.room).emit("recieve end call", { data });
  });
  socket.on("disconnect", (reason) => {
    if (myrooms.length > 0) {
      myrooms.map((r) => {
        io.in(r).emit("offline", { id });
      });
    }
    // update user status to offline in db
    User.findByIdAndUpdate(id, {
      $set: {
        isOnline: false,
      },
    })
  });
});

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = { app: app, httpServer: httpServer };
