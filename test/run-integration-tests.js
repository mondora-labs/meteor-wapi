var BPromise   = require("bluebird");
var bodyParser = require("body-parser");
var express    = require("express");
var Client     = require("mongodb").MongoClient;
var spawn      = require("child_process").spawn;

var MW = require("../src/mw.js");

var db;
var exitCode;
var mw;
BPromise.resolve()
    .then(function connectToDb () {
        return BPromise.promisify(Client.connect, Client)("mongodb://localhost:27017/mw-tests")
            .then(function (client) {
                db = client;
                return BPromise.resolve();
            });
    })
    .then(function insertFixtures () {
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
    .then(function setupMW () {
        mw = new MW(db);
        mw.methods({
            // Methods to test return values
            "echo": function (param) {
                return param;
            },
            "return:value": function () {
                return "return:value";
            },
            "throw:mw-error": function () {
                throw new MW.Error(400, "throw:mw-error");
            },
            "throw:error": function () {
                throw new Error("throw:error");
            },
            "return:promise:resolved": function () {
                return new BPromise(function (resolve, reject) {
                    setTimeout(function () {
                        resolve("return:promise:resolved");
                    }, 1000);
                });
            },
            "return:promise:rejected": function () {
                return new BPromise(function (resolve, reject) {
                    setTimeout(function () {
                        reject(new MW.Error(400, "return:promise:rejected"));
                    }, 1000);
                });
            },
            // Method to test user login
            "user": function () {
                return this.user;
            }
        });
        return BPromise.resolve();
    })
    .then(function setupServer () {
        return new BPromise(function (resolve, reject) {
            express()
                .use(bodyParser.json())
                .use(MW.bodyValidationMiddleware)
                .use(MW.contextMiddleware)
                .use(mw.getUserMiddleware())
                .post(mw.getRoute())
                .listen(4000, resolve);
        });
    })
    .then(function runTests () {
        return new BPromise(function (resolve, reject) {
            var mocha = spawn("node_modules/.bin/mocha", ["test/integration/**/*.js"]);
            mocha.on("close", function (code) {
                exitCode = code;
                resolve();
            });
        });
    })
    .then(function cleanupDb () {
        var users = db.collection("users");
        return BPromise.promisify(users.remove, users)({
            "_id" : "userId",
        });
    })
    .then(function exit () {
        process.exit(exitCode);
    })
    .catch(function (e) {
        console.error(e);
        process.exit(1);
    });
