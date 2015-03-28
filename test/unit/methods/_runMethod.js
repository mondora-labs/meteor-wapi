var R      = require("ramda");
var should = require("should");
var sinon  = require("sinon");

var methods = require("../../../src/methods.js");

describe("Unit suite - The `_runMethod` method", function () {

    it("should return a thenable", function () {
        var ret = methods._runMethod();
        ret.catch(R.identity);
        ret.then.should.be.of.type("function");
    });

    it("should actually call the method", function (done) {
        var ctx = {
            _methods: {
                method: sinon.spy()
            }
        };
        methods._runMethod.call(ctx, {}, "method")
            .then(function () {
                try {
                    ctx._methods.method.called.should.equal(true);
                } catch (e) {
                    return done(e);
                }
                done();
            })
            .catch(done);
    });

});

describe("Unit suite - The promise returned by `_runMethod`", function () {

    it("should be rejected if the method does not exist", function (done) {
        var ctx = {
            _methods: {}
        };
        methods._runMethod.call(ctx, {}, "method")
            .then(function () {
                done("The promise should have been rejected");
            })
            .catch(function (err) {
                try {
                    err.code.should.equal(404);
                    err.message.should.equal("Method not found");
                } catch (e) {
                    return done(e);
                }
                done();
            });
    });

    it("should be rejected if the method throws", function (done) {
        var error = {};
        var ctx = {
            _methods: {
                method: sinon.stub().throws(error)
            }
        };
        methods._runMethod.call(ctx, {}, "method")
            .then(function () {
                done("The promise should have been rejected");
            })
            .catch(function (err) {
                try {
                    err.should.equal(error);
                } catch (e) {
                    return done(e);
                }
                done();
            });
    });

    it("should be resolved with the value returned by the method", function (done) {
        var value = {};
        var ctx = {
            _methods: {
                method: sinon.stub().returns(value)
            }
        };
        methods._runMethod.call(ctx, {}, "method")
            .then(function (val) {
                try {
                    val.should.equal(value);
                } catch (e) {
                    return done(e);
                }
                done();
            })
            .catch(done);
    });

});