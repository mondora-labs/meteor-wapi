var BPromise = require("bluebird");
var express  = require("express");
var request  = require("supertest-as-promised");

var MW = require("../../");
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

    it("the server should auth the user if the loginToken is valid", function () {
        var mw = new MW(db);
        mw.methods({
            getUserId: function () {
                return this.userId;
            }
        });
        var app = express().use("/", mw.getRouter());
        return request(app)
            .post("/")
            .send({method: "getUserId", params: [], loginToken: "loginToken"})
            .expect("Content-Type", /json/)
            .expect(200)
            .expect({result: "userId"});
    });

    it("if the user is authenticated, methods should have available `this.userId` and `this.user`", function () {
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
            return request(app)
                .post("/")
                .send({method: "getUserIdAndUser", params: [], loginToken: "loginToken"})
                .expect("Content-Type", /json/)
                .expect(200)
                .expect({result: ["userId", user]});
        });
    });

    it("the server should reply 403 if the loginToken is invalid", function () {
        var mw = new MW(db);
        mw.methods({
            getUserId: function () {
                return this.userId;
            }
        });
        var app = express().use("/", mw.getRouter());
        return request(app)
            .post("/")
            .send({method: "getUserId", params: [], loginToken: "invalidLoginToken"})
            .expect("Content-Type", /json/)
            .expect(401)
            .expect({error: "Invalid loginToken"});
    });

    it("the server should let requests without loginToken through", function () {
        var mw = new MW(db);
        mw.methods({
            getUserId: function () {
                return this.userId;
            }
        });
        var app = express().use("/", mw.getRouter());
        return request(app)
            .post("/")
            .send({method: "getUserId", params: []})
            .expect("Content-Type", /json/)
            .expect(200)
            .expect({result: null});
    });

});
