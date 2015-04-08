var BPromise   = require("bluebird");
var bodyParser = require("body-parser");
var express    = require("express");
var request    = require("supertest");

var MW = require("../../src/mw.js");
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

    it("that do not exist", function (done) {
        var mw = new MW(db);
        var app = express().use("/", mw.getRoute());
        request(app)
            .post("/")
            .send({method: "nonexistentMethod", params: []})
            .expect("Content-Type", /json/)
            .expect(404)
            .expect({error: "Method not found"}, done);
    });

    it("that return undefined", function (done) {
        var mw = new MW(db);
        mw.methods({
            "return:value": function () {
            }
        });
        var app = express().use("/", mw.getRoute());
        request(app)
            .post("/")
            .send({method: "return:value", params: []})
            .expect("Content-Type", /json/)
            .expect(200)
            .expect({result: null}, done);
    });

    it("that return a value", function (done) {
        var mw = new MW(db);
        mw.methods({
            "return:value": function () {
                return "return:value";
            }
        });
        var app = express().use("/", mw.getRoute());
        request(app)
            .post("/")
            .send({method: "return:value", params: []})
            .expect("Content-Type", /json/)
            .expect(200)
            .expect({result: "return:value"}, done);
    });

    it("that throw a MW.Error", function (done) {
        var mw = new MW(db);
        mw.methods({
            "throw:mw-error": function () {
                throw new MW.Error(499, "MW.Error");
            }
        });
        var app = express().use("/", mw.getRoute());
        request(app)
            .post("/")
            .send({method: "throw:mw-error", params: []})
            .expect("Content-Type", /json/)
            .expect(499)
            .expect({error: "MW.Error"}, done);
    });

    it("that throw a generic error", function (done) {
        var mw = new MW(db);
        mw.methods({
            "throw:generic-error": function () {
                throw new Error("Generic error");
            }
        });
        var app = express().use("/", mw.getRoute());
        request(app)
            .post("/")
            .send({method: "throw:generic-error", params: []})
            .expect("Content-Type", /json/)
            .expect(500)
            .expect({error: "Internal server error"}, done);
    });

    it("that return a promise which is eventually resolved", function (done) {
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
        var app = express().use("/", mw.getRoute());
        request(app)
            .post("/")
            .send({method: "return:promise:resolved", params: []})
            .expect("Content-Type", /json/)
            .expect(200)
            .expect({result: "return:promise:resolved"}, done);
    });

    it("that return a promise which is eventually rejected with an MW.Error", function (done) {
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
        var app = express().use("/", mw.getRoute());
        request(app)
            .post("/")
            .send({method: "return:promise:rejected:mw-error", params: []})
            .expect("Content-Type", /json/)
            .expect(499)
            .expect({error: "MW.Error"}, done);
    });

    it("that return a promise which is eventually rejected with a generic error", function (done) {
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
        var app = express().use("/", mw.getRoute());
        request(app)
            .post("/")
            .send({method: "return:promise:rejected:generic-error", params: []})
            .expect("Content-Type", /json/)
            .expect(500)
            .expect({error: "Internal server error"}, done);
    });

});
