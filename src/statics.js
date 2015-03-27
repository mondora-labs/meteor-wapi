var BPromise = require("bluebird");
var R        = require("ramda");
var t        = require("tcomb-validation");

var getUserFromToken = require("./lib/get-user-from-token.js");
var MVError          = require("./lib/mv-error.js");
var errorHandler     = require("./lib/error-handler.js");

var statics = {

    BodyType: t.struct({
        method: t.Str,
        params: t.Arr,
        loginToken: t.maybe(t.Str)
    }),

    bodyValidationMiddleware: function (req, res, next) {
        var validation = t.validate(req.body, statics.BodyType);
        if (validation.isValid()) {
            next();
        } else {
            errorHandler(res, new MVError(400, validation.firstError()));
        }
    },

    contextMiddleware: function (req, res, next) {
        req.context = {
            userId: null
        };
        next();
    },

    userMiddleware: function (req, res, next) {
        if (R.isNil(req.body.loginToken)) {
            return next();
        }
        getUserFromToken(req.body.loginToken)
            .then(function (user) {
                if (R.isNil(user)) {
                    throw new MVError(401, "Invalid accessToken");
                }
                req.context.userId = user._id;
                req.context.user = user;
                next();
            })
            .catch(errorHandler(res));
    }

};

module.exports = statics;
