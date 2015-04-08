var BPromise = require("bluebird");
var t        = require("tcomb");

module.exports = t.irreducible("BPromise", function (p) {
    return p instanceof BPromise;
});
