var R = require("ramda");

var MVError = require("./mv-error.js");

module.exports = R.curry(function errorHandler (response, error) {
    if (R.is(MVError, error)) {
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
