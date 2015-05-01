var should = require("should");
var sinon  = require("sinon");

var resultHandler = require("lib/result-handler.js");

describe("Unit suite - The `resultHandler` function", function () {

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

        var res_0 = getResponse();
        resultHandler(res_0, {});
        res_0.status.calledWith(200).should.equal(true);
        res_0.send.calledWith({result: {}}).should.equal(true);

        var res_1 = getResponse();
        resultHandler(res_1, undefined);
        res_1.status.calledWith(200).should.equal(true);
        res_1.send.calledWith({result: null}).should.equal(true);

    });

});
