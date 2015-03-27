var R = require("ramda");

var MWError = require("./mw-error.js");

module.exports = R.curry(function errorHandler (response, error) {
    if (R.is(MWError, error)) {
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
