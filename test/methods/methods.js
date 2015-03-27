var R      = require("ramda");
var should = require("should");
var sinon  = require("sinon");

var methods = require("../../src/methods.js");

describe("The `methods` method", function () {

    it("should register methods", function () {
        var ctx = {
            _methods: {}
        };
        methods.methods.call(ctx, {
            name: R.identity
        });
        ctx._methods.name.should.equal(R.identity);
    });

    it("should throw if the map passed to it is not a dictionary of (string, function)", function () {
        var ctx = {
            _methods: {}
        };
        var troublemaker = function () {
            methods.methods.call(ctx, {
                name: "string"
            });
        };
        troublemaker.should.throw();
    });

});
