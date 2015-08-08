// not-messenger chat management
// @author: gabmontes

// Dependencies

var async = require("async");

var usersStore = require("./users-mem-store");

// Chat management

function addRoutes(app) {

    // Session management

    function getSessionUserName(session) {
        return session.user && session.user.name;
    }

    function setSessionUser(session, data) {
        session.user = data;
    }

    // Request handlers

    function checkNoAuth(req, res, next) {
        if (getSessionUserName(req.session)) {
            res.sendStatus(403); // Forbidden
            return;
        }
        next();
    }

    function checkAuth(req, res, next) {
        var name = getSessionUserName(req.session);
        if (!name) {
            res.sendStatus(401); // Unauthorized
            return;
        }
        next();
    }

    function createUser(req, res, next) {
        var name = req.body.name;
        if (!name) {
            res.sendStatus(400); // Bad request
            return;
        }
        name = name.toLowerCase();
        usersStore.get(name, function (err, user) {
            if (err) {
                next(err);
                return;
            }
            if (user) {
                // res.sendStatus(409); // Conflict
                setSessionUser(req.session, user.toJSON());
                res.send(user.toJSON());
                console.log("user %s recovered", name);
                return;
            }
            usersStore.create(name, function (err, user) {
                if (err) {
                    next(err);
                    return;
                }
                setSessionUser(req.session, user.toJSON());
                res.send(user.toJSON());
                console.log("user %s created", name);
            });
        });
    }

    function getCurrentUser(req, res, next) {
        var name = getSessionUserName(req.session);
        usersStore.get(name, function (err, user) {
            if (err) {
                next(err);
                return;
            }
            res.send(user.toJSON());
            console.log("user %s own data retrieved", name);
        });
    }

    function getUserData(req, res, next) {
        var name = req.params.name.toLowerCase();
        usersStore.get(name, function (err, user) {
            if (err) {
                next(err);
                return;
            }
            if (!user) {
                res.sendStatus(404); // Not found
                return;
            }
            var data = user.toJSON();
            res.send({
                name: data.name
            });
            console.log("user %s data retrieved", name);
        });
    }

    function getCurrentUserChats(req, res, next) {
        var name = getSessionUserName(req.session);
        usersStore.get(name, function (err, user) {
            if (err) {
                next(err);
                return;
            }
            res.send(user.peers);
            console.log("user %s chats retrieved", name);
        });
    }

    function getChatsWithUser(req, res, next) {
        var from = getSessionUserName(req.session);
        var to = req.params.name.toLowerCase();
        usersStore.get(from, function (err, user) {
            if (err) {
                next(err);
                return;
            }
            res.send(user.getChatsWith(to));
            console.log("user %s chats with %s retrieved", from, to);
        });
    }

    function sendChatToUser(req, res, next) {
        var from = getSessionUserName(req.session);
        var to = req.params.name.toLowerCase();
        var text = req.body.text;
        if (!text) {
            res.sendStatus(400); // Bad request
            return;
        }
        async.parallel({
            from: async.apply(usersStore.get, from),
            to: async.apply(usersStore.get, to)
        }, function (err, users) {
            if (err) {
                next(err);
                return;
            }
            if (!users.to) {
                res.sendStatus(404); // Not found
                return;
            }
            users.from.send(users.to, text, function (err) {
                if (err) {
                    next(err);
                    return;
                }
                res.sendStatus(200); // OK
                console.log("user %s sent message to %s", from, to);
            });
        });
    }

    // Routes

    app.post("/me", checkNoAuth, createUser);
    app.get("/me", checkAuth, getCurrentUser);
    // app.post("/me/photo", checkAuth, uploadCurrentUserPhoto);
    app.get("/users/:name", checkAuth, getUserData);
    app.get("/chats", checkAuth, getCurrentUserChats);
    app.get("/chats/:name", checkAuth, getChatsWithUser);
    app.post("/chats/:name", checkAuth, sendChatToUser);

}

// Module interface

module.exports = {
    init: addRoutes
};
