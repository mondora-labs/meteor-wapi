var R      = require("ramda");
var should = require("should");
var sinon  = require("sinon");

var statics = require("../../../src/statics.js");

describe("Unit suite - The `contextMiddleware` function", function () {

    it("should attach a default context to the request", function () {
        var req = {};
        var res = {};
        var next = sinon.spy();
        statics.contextMiddleware(req, res, next);
        req.context.should.eql({userId: null});
        next.called.should.equal(true);
    });

});
