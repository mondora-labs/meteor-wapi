var R = require("ramda");

var methods = require("./methods.js");
var MWError = require("./lib/mw-error.js");

var MW = function (db) {
    // db is a mongo client
    this.db = db;
    this._methods = {};
};
MW.Error = MWError;
// Merge methods
MW.prototype = R.merge(MW.prototype, methods);

module.exports = MW;
