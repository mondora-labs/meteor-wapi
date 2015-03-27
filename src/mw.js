var R = require("ramda");

var statics = require("./statics.js");
var methods = require("./methods.js");
var MWError = require("./lib/mw-error.js");

var MW = function () {
    this._methods = {};
};

// Merge statics
R.pipe(
    R.toPairs,
    R.forEach(R.apply(function (key, val) {
        MW[key] = val;
    }))
)(statics);
MW.MWError = MWError;

// Merge methods
MW.prototype = R.merge(MW.prototype, methods);

module.exports = MW;
