var should = require("should");
var sinon  = require("sinon");

var errorHandler = require("lib/error-handler.js");
var MWError      = require("lib/mw-error.js");

describe("Unit suite - The `errorHandler` function", function () {

    var getResponse = function () {
        var res = {
            status: sinon.spy(function () {
                return res;
            }),
            send: sinon.spy()
        };
        return res;
    };

    before(function () {
        sinon.stub(console, "error");
    });
    after(function () {
        console.error.restore();
    });

    it("should send the custom error if it's an instance of MWError", function () {
        var res = getResponse();
        errorHandler(res, new MWError(400, "Message"));
        res.status.calledWith(400).should.equal(true);
        res.send.calledWith({error: "Message"}).should.equal(true);
    });

    it("should send a 500 if the error is not an instance of MWError", function () {
        var res = getResponse();
        errorHandler(res, new Error("Message"));
        res.status.calledWith(500).should.equal(true);
        res.send.calledWith({error: "Internal server error"}).should.equal(true);
    });

    it("should log an error if the error is not an instance of MWError", function () {
        var error = new Error("Message");
        var res = getResponse();
        errorHandler(res, error);
        console.error.calledWith(error).should.equal(true);
    });

});
