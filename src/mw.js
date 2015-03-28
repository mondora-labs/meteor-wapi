var R = require("ramda");

var statics = require("./statics.js");
var methods = require("./methods.js");

var MW = function (db) {
    // db is a mongo client
    this.db = db;
    this._methods = {};
};

// Merge statics (can't use R.merge because MW is a function)
R.keys(statics).forEach(function (key) {
    MW[key] = statics[key];
});
// Merge methods
MW.prototype = R.merge(MW.prototype, methods);

module.exports = MW;
