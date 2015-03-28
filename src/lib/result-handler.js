var R = require("ramda");

module.exports = R.curry(function resultHandler (response, result) {
    response.status(200).send({
        result: (result !== undefined) ? result : null
    });
});
