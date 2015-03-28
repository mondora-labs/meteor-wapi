var t = require("tcomb-validation");

var MWError      = require("./lib/mw-error.js");
var errorHandler = require("./lib/error-handler.js");
var BodyType     = require("./lib/body-type.js");

var statics = {

    Error: MWError,

    bodyValidationMiddleware: function (req, res, next) {
        var validation = t.validate(req.body, BodyType);
        if (validation.isValid()) {
            next();
        } else {
            errorHandler(res, new MWError(400, validation.firstError()));
        }
    },

    contextMiddleware: function (req, res, next) {
        req.context = {
            userId: null
        };
        next();
    }

};

module.exports = statics;
