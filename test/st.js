var BPromise = require("bluebird");
var Client   = require("mongodb").MongoClient;

exports.setup = function () {
    var db;
    return BPromise.resolve()
        .then(function connect () {
            return BPromise.promisify(Client.connect, Client)("mongodb://localhost:27017/mw-tests")
                .then(function (client) {
                    db = client;
                    return BPromise.resolve();
                });
        })
        .then(function fixtures () {
            var users = db.collection("users");
            return BPromise.promisify(users.insert, users)({
                "_id" : "userId",
                "services" : {
                    "resume" : {
                        "loginTokens" : [{
                            "when" : new Date(),
                            // base64 sha256 hash of `loginToken`
                            "hashedToken" : "hXo6rKYfhZAd7rrL1nX3PwkchepS+DXcVq13tLro+yg="
                        }]
                    }
                }
            });
        })
        .then(function () {
            return BPromise.resolve(db);
        });
};

exports.teardown = function (db) {
    return BPromise.resolve()
        .then(function cleanup () {
            var users = db.collection("users");
            return BPromise.promisify(users.remove, users)({
                "_id" : "userId",
            });
        })
        .then(function close () {
            return BPromise.promisify(db.close, db)();
        });
};
