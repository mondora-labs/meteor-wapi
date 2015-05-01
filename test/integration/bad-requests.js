var BPromise = require("bluebird");
var express  = require("express");
var request  = require("supertest-as-promised");

var MW = require("../../");
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

    it("the server should reply a 400 on malformed body", function () {
        var mw = new MW(db);
        var app = express().use("/", mw.getRouter());
        return request(app)
            .post("/")
            .send({unexpectedProp: "unexpectedValue"})
            .expect("Content-Type", /json/)
            .expect(400);
    });

});
