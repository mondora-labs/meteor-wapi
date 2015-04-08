var BPromise   = require("bluebird");
var bodyParser = require("body-parser");
var express    = require("express");
var request    = require("supertest");

var MW = require("../../src/mw.js");
var st = require("../st.js");

describe("Integration suite - Bad requests", function () {

    var db;
    before(function () {
        return st.setup().then(function (dbConnection) {
            db = dbConnection;
        });
    });
    after(function () {
        return st.teardown(db);
    });

    it("the server should reply a 400 on malformed body", function (done) {
        var mw = new MW(db);
        var app = express().use("/", mw.getRoute());
        request(app)
            .post("/")
            .send({unexpectedProp: "unexpectedValue"})
            .expect("Content-Type", /json/)
            .expect(400, done);
    });

});
