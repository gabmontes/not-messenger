// not-messenger users store
// @author: gabmontes

// Memory users store

var users = {};

// User object

function User(name) {
    this.name = name;
    this.chats = {};
    this.peers = [];
}

User.prototype.send = function (to, text, callback) {
    var now = Date.now();
    var chatItem = {
        from: this.name,
        to: to.name,
        text: text,
        time: now
    };

    this.chats[to.name] = this.chats[to.name] || [];
    this.chats[to.name].push(chatItem);
    var toPeer = this.peers.map(function (peer) {
        return peer.name;
    }).indexOf(to.name);
    if (toPeer !== -1) {
        this.peers.splice(toPeer, 1);
    }
    this.peers.unshift({
        name: to.name,
        last: text,
        time: now
    });

    var fromPeer = to.peers.map(function (peer) {
        return peer.name;
    }).indexOf(this.name);
    var peer = {};
    if (fromPeer !== -1) {
        peer = to.peers.splice(fromPeer, 1)[0];
    }
    to.peers.unshift({
        name: this.name,
        unread: (peer.unread || 0) + 1,
        last: text,
        time: now
    });

    callback(null);
};

User.prototype.getChatsWith = function (name) {
    var toPeer = this.peers.map(function (peer) {
        return peer.name;
    }).indexOf(name);
    if (toPeer === -1) {
        return [];
    }
    this.peers[toPeer].unread = 0;
    return this.chats[name];
};

User.prototype.toJSON = function () {
    return {
        name: this.name
    };
};

// Store functions

function createUser(name, callback) {
    var user = new User(name);
    users[name] = user;
    callback(null, user);
}

function getUser(name, callback) {
    callback(null, users[name]);
}

// Interface

module.exports = {
    get: getUser,
    create: createUser
};
