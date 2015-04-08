var BPromise = require("bluebird");
var R        = require("ramda");
var t        = require("tcomb-validation");

var BodyType         = require("./lib/body-type.js");
var errorHandler     = require("./lib/error-handler.js");
var getUserFromToken = require("./lib/get-user-from-token.js");
var MWError          = require("./lib/mw-error.js");

/*
*   To keep a consistent API between middleware (i.e., each property of the
*   exported object is a getter for the actual middleware function) we "wrap"
*   `bodyValidation` and `context` functions in `R.always`.
*/
module.exports = {

    bodyValidation: R.always(function (req, res, next) {
        var validation = t.validate(req.body, BodyType);
        if (validation.isValid()) {
            next();
        } else {
            errorHandler(res, new MWError(400, validation.firstError()));
        }
    }),

    context: R.always(function (req, res, next) {
        req.context = {
            userId: null
        };
        next();
    }),

    user: function (mwInstance) {
        return function (req, res, next) {
            if (R.isNil(req.body.loginToken)) {
                return next();
            }
            getUserFromToken(mwInstance, req.body.loginToken)
                .then(function (user) {
                    if (R.isNil(user)) {
                        throw new MWError(401, "Invalid loginToken");
                    }
                    req.context.userId = user._id;
                    req.context.user = user;
                    next();
                })
                .catch(errorHandler(res));
        };
    }

};
