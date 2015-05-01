var BPromise = require("bluebird");
var express  = require("express");
var request  = require("supertest-as-promised");

var MW = require("../../");
var st = require("../st.js");

describe("Integration suite - Methods", function () {

    var db;
    before(function () {
        return st.setup().then(function (dbConnection) {
            db = dbConnection;
        });
    });
    after(function () {
        return st.teardown(db);
    });

    it("that do not exist", function () {
        var mw = new MW(db);
        var app = express().use("/", mw.getRouter());
        return request(app)
            .post("/")
            .send({method: "nonexistentMethod", params: []})
            .expect("Content-Type", /json/)
            .expect(404)
            .expect({error: "Method not found"});
    });

    it("that return undefined", function () {
        var mw = new MW(db);
        mw.methods({
            "return:value": function () {
            }
        });
        var app = express().use("/", mw.getRouter());
        return request(app)
            .post("/")
            .send({method: "return:value", params: []})
            .expect("Content-Type", /json/)
            .expect(200)
            .expect({result: null});
    });

    it("that return a value", function () {
        var mw = new MW(db);
        mw.methods({
            "return:value": function () {
                return "return:value";
            }
        });
        var app = express().use("/", mw.getRouter());
        return request(app)
            .post("/")
            .send({method: "return:value", params: []})
            .expect("Content-Type", /json/)
            .expect(200)
            .expect({result: "return:value"});
    });

    it("that throw a MW.Error", function () {
        var mw = new MW(db);
        mw.methods({
            "throw:mw-error": function () {
                throw new MW.Error(499, "MW.Error");
            }
        });
        var app = express().use("/", mw.getRouter());
        return request(app)
            .post("/")
            .send({method: "throw:mw-error", params: []})
            .expect("Content-Type", /json/)
            .expect(499)
            .expect({error: "MW.Error"});
    });

    it("that throw a generic error", function () {
        var mw = new MW(db);
        mw.methods({
            "throw:generic-error": function () {
                throw new Error("Generic error");
            }
        });
        var app = express().use("/", mw.getRouter());
        return request(app)
            .post("/")
            .send({method: "throw:generic-error", params: []})
            .expect("Content-Type", /json/)
            .expect(500)
            .expect({error: "Internal server error"});
    });

    it("that return a promise which is eventually resolved", function () {
        var mw = new MW(db);
        mw.methods({
            "return:promise:resolved": function () {
                return new BPromise(function (resolve, reject) {
                    setTimeout(function () {
                        resolve("return:promise:resolved");
                    }, 10);
                });
            }
        });
        var app = express().use("/", mw.getRouter());
        return request(app)
            .post("/")
            .send({method: "return:promise:resolved", params: []})
            .expect("Content-Type", /json/)
            .expect(200)
            .expect({result: "return:promise:resolved"});
    });

    it("that return a promise which is eventually rejected with an MW.Error", function () {
        var mw = new MW(db);
        mw.methods({
            "return:promise:rejected:mw-error": function () {
                return new BPromise(function (resolve, reject) {
                    setTimeout(function () {
                        reject(new MW.Error(499, "MW.Error"));
                    }, 10);
                });
            }
        });
        var app = express().use("/", mw.getRouter());
        return request(app)
            .post("/")
            .send({method: "return:promise:rejected:mw-error", params: []})
            .expect("Content-Type", /json/)
            .expect(499)
            .expect({error: "MW.Error"});
    });

    it("that return a promise which is eventually rejected with a generic error", function () {
        var mw = new MW(db);
        mw.methods({
            "return:promise:rejected:generic-error": function () {
                return new BPromise(function (resolve, reject) {
                    setTimeout(function () {
                        reject(new Error("Generic error"));
                    }, 10);
                });
            }
        });
        var app = express().use("/", mw.getRouter());
        return request(app)
            .post("/")
            .send({method: "return:promise:rejected:generic-error", params: []})
            .expect("Content-Type", /json/)
            .expect(500)
            .expect({error: "Internal server error"});
    });

});
