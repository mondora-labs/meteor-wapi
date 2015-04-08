var BPromise   = require("bluebird");
var bodyParser = require("body-parser");
var express    = require("express");
var request    = require("supertest");

var MW = require("../../src/mw.js");
var st = require("../st.js");

describe("Integration suite - User auth", function () {

    var db;
    before(function () {
        return st.setup().then(function (dbConnection) {
            db = dbConnection;
        });
    });
    after(function () {
        return st.teardown(db);
    });

    it("the server should auth the user if the loginToken is valid", function (done) {
        var mw = new MW(db);
        mw.methods({
            getUserId: function () {
                return this.userId;
            }
        });
        var app = express().use("/", mw.getRouter());
        request(app)
            .post("/")
            .send({method: "getUserId", params: [], loginToken: "loginToken"})
            .expect("Content-Type", /json/)
            .expect(200)
            .expect({result: "userId"}, done);
    });

    it("if the user is authenticated, methods should have available `this.userId` and `this.user`", function (done) {
        db.collection("users").findOne({_id: "userId"}, function (err, user) {
            // Stringify and parse to convert the Date object at `services.resume.loginTokens.when`
            user = JSON.parse(JSON.stringify(user));
            var mw = new MW(db);
            mw.methods({
                getUserIdAndUser: function () {
                    return [this.userId, this.user];
                }
            });
            var app = express().use("/", mw.getRouter());
            request(app)
                .post("/")
                .send({method: "getUserIdAndUser", params: [], loginToken: "loginToken"})
                .expect("Content-Type", /json/)
                .expect(200)
                .expect({result: ["userId", user]}, done);
        });
    });

    it("the server should reply 403 if the loginToken is invalid", function (done) {
        var mw = new MW(db);
        mw.methods({
            getUserId: function () {
                return this.userId;
            }
        });
        var app = express().use("/", mw.getRouter());
        request(app)
            .post("/")
            .send({method: "getUserId", params: [], loginToken: "invalidLoginToken"})
            .expect("Content-Type", /json/)
            .expect(401)
            .expect({error: "Invalid loginToken"}, done);
    });

    it("the server should let requests without loginToken through", function (done) {
        var mw = new MW(db);
        mw.methods({
            getUserId: function () {
                return this.userId;
            }
        });
        var app = express().use("/", mw.getRouter());
        request(app)
            .post("/")
            .send({method: "getUserId", params: []})
            .expect("Content-Type", /json/)
            .expect(200)
            .expect({result: null}, done);
    });

});
