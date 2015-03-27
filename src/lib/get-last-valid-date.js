/*
*   Mirrors Meteor's DEFAULT_LOGIN_EXPIRATION_DAYS
*/

var DEFAULT_LOGIN_EXPIRATION_DAYS = 90;
var DEFAULT_LOGIN_EXPIRATION_MS = DEFAULT_LOGIN_EXPIRATION_DAYS * 24 * 60 * 60 * 1000;

module.exports = function getLastValidDate () {
    var lastValidDateTimestamp = Date.now() - DEFAULT_LOGIN_EXPIRATION_MS;
    return new Date(lastValidDateTimestamp);
};
