var R      = require("ramda");
var should = require("should");

var getUserFromToken = require("lib/get-user-from-token.js");

describe("Unit suite - The `getUserFromToken` function", function () {

    it("should return a thenable", function () {
        var mwInstance = {
            db: {
                collection: function () {
                    return {
                        findOne: R.always(null)
                    };
                }
            }
        };
        var ret = getUserFromToken(mwInstance, "loginToken");
        ret.then.should.be.of.type("function");
    });

});
