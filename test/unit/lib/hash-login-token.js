var should = require("should");

var hashLoginToken = require("../../../src/lib/hash-login-token.js");

describe("Unit suite - The `hashLoginToken` function", function () {

    it("should hash with sha256 the passed in string and return it as a base64 string", function () {
        var ret = hashLoginToken("hello");
        ret.should.equal("LPJNul+wow4m6DsqxbninhsWHlwfp0JecwQzYpOLmCQ=");
    });

});
