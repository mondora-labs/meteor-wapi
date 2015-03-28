var R      = require("ramda");
var should = require("should");

var methods = require("../../../src/methods.js");

describe("Unit suite - The `_getUserFromToken` method", function () {

    it("should return a thenable", function () {
        var ctx = {
            db: {
                collection: function () {
                    return {
                        findOne: R.always(null)
                    };
                }
            }
        };
        var ret = methods._getUserFromToken.call(ctx, "loginToken");
        ret.then.should.be.of.type("function");
    });

});
