var R      = require("ramda");
var should = require("should");
var sinon  = require("sinon");

var middleware = require("middleware.js");

describe("Unit suite - The `bodyValidation` middleware getter", function () {

    it("should return a middleware function", function () {
        var bodyValidationMiddleware = middleware.bodyValidation();
        bodyValidationMiddleware.should.be.of.type("function");
        bodyValidationMiddleware.length.should.equal(3);
    });

});

describe("Unit suite - The middleware function returned by the `bodyValidation` middleware getter", function () {

    it("should stop the request with an error if the body is malformed", function () {
        var req = {
            body: "malformed body"
        };
        var res = {
            status: sinon.spy(function () {
                return res;
            }),
            send: sinon.spy()
        };
        var next = sinon.spy();
        var bodyValidationMiddleware = middleware.bodyValidation();
        bodyValidationMiddleware(req, res, next);
        res.status.called.should.equal(true);
        res.send.called.should.equal(true);
    });

    it("should let the request through if the body is well-formed", function () {
        var req = {
            body: {
                method: "method",
                params: []
            }
        };
        var res = {};
        var next = sinon.spy();
        var bodyValidationMiddleware = middleware.bodyValidation();
        bodyValidationMiddleware(req, res, next);
        next.called.should.equal(true);
    });

});
