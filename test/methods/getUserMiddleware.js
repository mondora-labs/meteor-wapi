var BPromise = require("bluebird");
var R        = require("ramda");
var should   = require("should");
var sinon    = require("sinon");

var methods = require("../../src/methods.js");

describe("The `getUserMiddleware` method", function () {

    it("should return a function", function () {
        methods.getUserMiddleware().should.be.of.type("function");
    });

});

describe("The function returned by `getUserMiddleware`", function () {

    it("should let the request through if it doesn't have a `loginToken`", function () {
        var userMiddleware = methods.getUserMiddleware();
        var req = {body: {}};
        var res = {};
        var next = sinon.spy();
        userMiddleware(req, res, next);
        next.called.should.equal(true);
    });

    it("should 401 if there's an invalid `loginToken`", function (done) {
        sinon.stub(methods, "_getUserFromToken").returns(BPromise.resolve(null));
        var userMiddleware = methods.getUserMiddleware();
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
                methods._getUserFromToken.restore();
                done(err);
            })
        };
        var next = sinon.spy();
        userMiddleware(req, res, next);
    });

    it("should let the request through and attach the user object to the context", function (done) {
        sinon.stub(methods, "_getUserFromToken").returns(BPromise.resolve({_id: "userId"}));
        var userMiddleware = methods.getUserMiddleware();
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
            methods._getUserFromToken.restore();
            done(err);
        });
        userMiddleware(req, res, next);
    });

});
