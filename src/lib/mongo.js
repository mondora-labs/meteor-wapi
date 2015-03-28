var BPromise    = require("bluebird");
var MongoClient = require("mongodb").MongoClient;

var url = process.env.MONGO_URL || "mongodb://localhost:3001/meteor";

var connect = function () {
    return new BPromise(function (resolve, reject) {
        MongoClient.connect(url, function (error, client) {
            if (error) {
                return reject(error);
            }
            return resolve(client);
        });
    });
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
