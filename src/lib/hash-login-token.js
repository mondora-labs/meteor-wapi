var crypto = require("crypto");

/*
*   Mirrors Meteor's implementation, as found in the Accounts._hashLoginToken
*   function defined in the accounts-base package.
*/

module.exports = function hashLoginToken (loginToken) {
    return crypto
        .createHash("sha256")
        .update(loginToken)
        .digest("base64");
};
