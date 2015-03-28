var BPromise = require("bluebird");
var R        = require("ramda");
var should   = require("should");
var sinon    = require("sinon");

var methods = require("../../../src/methods.js");

describe("Unit suite - The `getRoute` method", function () {

    it("should return a function", function () {
        methods.getRoute().should.be.of.type("function");
    });

});

describe("Unit suite - The function returned by `getRoute`", function () {

    it("should call the `_runMethod` method", function () {
        var ctx = {
            _runMethod: sinon.spy(function () {
                return new BPromise(R.identity);
            })
        };
        var route = methods.getRoute.call(ctx);
        var req = {
            context: {},
            body: {
                method: "method",
                params: []
            }
        };
        route(req);
        ctx._runMethod.calledWith(req.context, req.body.method, req.body.params).should.equal(true);
    });

});
