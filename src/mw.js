var R = require("ramda");

var statics = require("./statics.js");
var methods = require("./methods.js");

var MV = function () {
    this._methods = {};
};

MV = R.merge(MV, statics);
MV = R.merge(MV, methods);

module.exports = MV;
