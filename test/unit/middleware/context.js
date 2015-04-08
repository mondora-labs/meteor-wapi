var R      = require("ramda");
var should = require("should");
var sinon  = require("sinon");

var middleware = require("../../../src/middleware.js");

describe("Unit suite - The `context` middleware getter", function () {

    it("should return a middleware function", function () {
        var contextMiddleware = middleware.context();
        contextMiddleware.should.be.of.type("function");
        contextMiddleware.length.should.equal(3);
    });

});

describe("Unit suite - The middleware function returned by the `context` middleware getter", function () {

    it("should attach a default context to the request", function () {
        var req = {};
        var res = {};
        var next = sinon.spy();
        var contextMiddleware = middleware.context();
        contextMiddleware(req, res, next);
        req.context.should.eql({userId: null});
        next.called.should.equal(true);
    });

});
