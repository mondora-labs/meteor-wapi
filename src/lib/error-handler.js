var R = require("ramda");

var MCError = require("./mc-error.js");

module.exports = R.curry(function errorHandler (response, error) {
    if (R.is(MCError, error)) {
        response.status(error.code).send({
            error: error.message
        });
    } else {
        // TODO - Log more?
        console.error(error);
        response.status(500).send({
            error: "Internal server error"
        });
    }
});
