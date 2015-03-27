var BPromise = require("bluebird");

var getLastValidDate = require("./get-last-valid-date.js");
var hashLoginToken   = require("./hash-login-token.js");
var mongo            = require("./mongo.js");

module.exports = function getUserFromToken (loginToken) {
    mongo.getClient().then(function (client) {
        var users = client.getCollection("users");
        return BPromise.promisify(users.findOne, users)({
            "services.resume.loginTokens": {
                $elemMatch: {
                    hadhedToken: hashLoginToken(loginToken),
                    when: {
                        $gt: getLastValidDate()
                    }
                }
            }
        });
    });
};
