var BPromise = require("bluebird");
var express  = require("express");
var R        = require("ramda");
var should   = require("should");
var sinon    = require("sinon");

var methods = require("methods.js");

describe("Unit suite - The `getRouter` method", function () {

    it("should return an express.Router", function () {
        /*
        *   express routers are not instances of any class, therefore we can't
        *   use `instanceOf` for this test. Instead we test it against the
        *   current implementation, where a router is a function which has,
        *   according to its API, a `use` property (which is a function too).
        */
        var router = methods.getRouter();
        router.should.be.of.type("function");
        router.use.should.be.of.type("function");
    });

});

describe("Unit suite - The function returned by `getRouter`", function () {

    it("should call the `_runMethod` method", function () {
        var ctx = {
            _runMethod: sinon.spy(function () {
                return new BPromise(R.identity);
            })
        };
        var route = methods.getRouter.call(ctx);
        /*
        *   Mock the request "only as much as needed" to make it pass through
        *   the router. We accept this poor compromise since this part is also
        *   thoroughly tested with integration tests.
        */
        var req = {
            url: "/",
            method: "POST",
            context: {},
            /*
            *   If the bodyParser middleware finds a _body property on the
            *   request, it lets it through.
            */
            _body: "notUndefined",
            body: {
                method: "method",
                params: []
            }
        };
        var res = {};
        var next = R.identity;
        route(req, res, next);
        ctx._runMethod.calledWith(req.context, req.body.method, req.body.params).should.equal(true);
    });

});
