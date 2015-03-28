var should = require("should");
var sinon  = require("sinon");

var resultHandler = require("../../src/lib/result-handler.js");

describe("The `resultHandler` function", function () {

    var getResponse = function () {
        var res = {
            status: sinon.spy(function () {
                return res;
            }),
            send: sinon.spy()
        };
        return res;
    };

    it("should send the provided response with a 200 HTTP code", function () {
        var res = getResponse();
        resultHandler(res, {});
        res.status.calledWith(200).should.equal(true);
        res.send.calledWith({result: {}}).should.equal(true);
    });

});
