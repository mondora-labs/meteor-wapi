var BPromise = require("bluebird");

var getLastValidDate = require("./get-last-valid-date.js");
var hashLoginToken   = require("./hash-login-token.js");

module.exports = function getUserFromToken (mwInstance, loginToken) {
    var users = mwInstance.db.collection("users");
    return BPromise.promisify(users.findOne, users)({
        "services.resume.loginTokens": {
            $elemMatch: {
                hashedToken: hashLoginToken(loginToken),
                when: {
                    $gt: getLastValidDate()
                }
            }
        }
    });
};
