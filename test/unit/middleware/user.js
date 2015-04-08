var BPromise = require("bluebird");
var R        = require("ramda");
var should   = require("should");
var sinon    = require("sinon");

var middleware = require("../../../src/middleware.js");

describe("Unit suite - The `user` middleware getter", function () {

    it("should return a middleware function", function () {
        var userMiddleware = middleware.user();
        userMiddleware.should.be.of.type("function");
        userMiddleware.length.should.equal(3);
    });

});

describe("Unit suite - The middleware function returned by the `user` middleware getter", function () {

    it("should let the request through if it doesn't have a `loginToken`", function () {
        var userMiddleware = middleware.user();
        var req = {body: {}};
        var res = {};
        var next = sinon.spy();
        userMiddleware(req, res, next);
        next.called.should.equal(true);
    });

    it("should 401 if there's an invalid `loginToken` (which doesn't match any user)", function (done) {
        var userMiddleware = middleware.user({
            db: {
                collection: R.always({
                    findOne: function (selector, cb) {
                        cb(null, undefined);
                    }
                })
            }
        });
        var req = {
            body: {
                loginToken: "invalid"
            }
        };
        var res = {
            status: sinon.spy(function () {
                return res;
            }),
            send: sinon.spy(function () {
                var err;
                try {
                    res.status.calledWith(401).should.equal(true);
                    res.send.called.should.equal(true);
                    res.send.calledWith({error: "Invalid loginToken"}).should.equal(true);
                } catch (e) {
                    err = e;
                }
                done(err);
            })
        };
        var next = sinon.spy();
        userMiddleware(req, res, next);
    });

    it("should let the request through and attach the user object to the context", function (done) {
        var userMiddleware = middleware.user({
            db: {
                collection: R.always({
                    findOne: function (selector, cb) {
                        cb(null, {_id: "userId"});
                    }
                })
            }
        });
        var req = {
            body: {
                loginToken: "valid"
            },
            context: {}
        };
        var res = {};
        var next = sinon.spy(function () {
            var err;
            try {
                req.context.userId.should.equal("userId");
                req.context.user.should.eql({_id: "userId"});
                next.called.should.equal(true);
            } catch (e) {
                err = e;
            }
            done(err);
        });
        userMiddleware(req, res, next);
    });

});
