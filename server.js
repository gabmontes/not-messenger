// not-messenger server
// @author: gabmontes

// Dependencies

var express = require("express");
var bodyParser = require("body-parser");
var session = require("express-session");
var cors = require("cors");

var chatManager = require("./chat-manager");

// Express HTTP/REST server

var app = express();

// Express configuration

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(session({
    cookie: {
        maxAge: 600000 // 10 min
    },
    resave: false,
    rolling: true,
    saveUninitialized: false,
    secret: "not-messenger-secret",
}));

// Allow CORS

app.all("*", cors({
    origin: true,
    credentials: true
}));

// Express routes

chatManager.init(app);

// Start server

app.listen(4000, function () {
    console.log("server listening on port 4000");
});
