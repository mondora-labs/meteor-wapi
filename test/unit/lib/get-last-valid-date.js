var should = require("should");

var getLastValidDate = require("../../../src/lib/get-last-valid-date.js");

describe("Unit suite - The `getLastValidDate` function", function () {

    it("should get the last valid date from now", function () {
        var EIGHTYNINE_DAYS_AGO_IN_MS = Date.now() - (89 * 24 * 60 * 60 * 1000);
        var ret = getLastValidDate();
        (ret.getTime() < EIGHTYNINE_DAYS_AGO_IN_MS).should.equal(true);
    });

});
