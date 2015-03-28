var BPromise    = require("bluebird");
var MongoClient = require("mongodb").MongoClient;

var url = process.env.MONGO_URL || "mongodb://localhost:3001/meteor";

var connect = function () {
    return BPromise.promisify(MongoClient.connect, MongoClient)(url);
};

var currentClient = null;

exports.getClient = function getClient () {
    if (
        // TODO - maybe check, for instance, if currentClient is still connected
        R.isNil(currentClient)
    ) {
        currentClient = connect();
        return currentClient;
    } else {
        return currentClient;
    }
};
