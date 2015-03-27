var BPromise = require("bluebird");
var R        = require("ramda");
var should   = require("should");
var sinon    = require("sinon");
var rewire   = require("rewire");

var statics = rewire("../../src/statics.js");

describe("The `userMiddleware` function", function () {

    it("should let the request through if it doesn't have a `loginToken`", function () {
        var req = {body: {}};
        var res = {};
        var next = sinon.spy();
        statics.userMiddleware(req, res, next);
        next.called.should.equal(true);
    });

    it("should 401 if there's an invalid `loginToken`", function () {
        // BEFORE (inline with test to avoid polluting describe's scope)
        var getUserFromToken = statics.__get__("getUserFromToken");
        // TEST
        var troublemaker;
        statics.__set__("getUserFromToken", function () {
            var promise = {
                then: function (fn) {
                    troublemaker = fn;
                    return promise;
                },
                catch: R.identity
            };
            return promise;
        });
        var req = {
            body: {
                loginToken: "invalid"
            }
        };
        var res = {};
        var next = sinon.spy();
        statics.userMiddleware(req, res, next);
        troublemaker.should.throw();
        // AFTER
        statics.__set__("getUserFromToken", getUserFromToken);
    });

    it("should let the request through and attach the user object to the context", function () {
        // BEFORE (inline with test to avoid polluting describe's scope)
        var getUserFromToken = statics.__get__("getUserFromToken");
        // TEST
        var peacemaker;
        statics.__set__("getUserFromToken", function () {
            var promise = {
                then: function (fn) {
                    peacemaker = fn;
                    return promise;
                },
                catch: R.identity
            };
            return promise;
        });
        var req = {
            body: {
                loginToken: "invalid"
            },
            context: {}
        };
        var res = {};
        var next = sinon.spy();
        statics.userMiddleware(req, res, next);
        var user = {};
        peacemaker(user);
        req.context.user.should.equal(user);
        next.called.should.equal(true);
        // AFTER
        statics.__set__("getUserFromToken", getUserFromToken);
    });

});
