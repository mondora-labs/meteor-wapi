var R = require("ramda");

var statics = require("./statics.js");
var methods = require("./methods.js");

var MC = function () {
    this._methods = {};
};

MC = R.merge(MC, statics);
MC = R.merge(MC, methods);

module.exports = MC;
