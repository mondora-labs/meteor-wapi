var R      = require("ramda");
var should = require("should");
var sinon  = require("sinon");

var methods = require("methods.js");

describe("Unit suite - The `methods` method", function () {

    it("should register methods", function () {
        var ctx = {
            _methods: {}
        };
        var optionalContext = {};
        methods.methods.call(ctx, {
            name: R.identity
        }, optionalContext);
        ctx._methods.name.fn.should.equal(R.identity);
        ctx._methods.name.context.should.equal(optionalContext);
    });

    it("should type-check its arguments (throwing in case of mismatches)", function () {
        var ctx = {
            _methods: {}
        };
        var troublemaker_0 = function () {
            methods.methods.call(ctx, {
                name: "notAFunction"
            });
        };
        troublemaker_0.should.throw();
        var troublemaker_1 = function () {
            methods.methods.call(ctx, {
                name: R.identity
            }, "notAnObject");
        };
        troublemaker_1.should.throw();
    });

});
