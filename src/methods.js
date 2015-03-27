var BPromise = require("bluebird");
var R        = require("ramda");
var t        = require("tcomb-validation");

var errorHandler  = require("./lib/error-handler.js");
var MWError       = require("./lib/mw-error.js");
var resultHandler = require("./lib/result-handler.js");

/*
*   By convention, a method can either:
*   - throw
*   - return a value
*   - return a thenable
*/

var methods = {

    _runMethod: function (context, name, args) {
        var self = this;
        return new BPromise(function (resolve, reject) {
            try {
                var fn = self._methods[name];
                if (!fn) {
                    throw new MWError(404, "Method not found");
                }
                resolve(
                    fn.apply(context, args)
                );
            } catch (e) {
                return reject(e);
            }
        });
    },

    methods: t.func(t.dict(t.Str, t.Func), t.Nil).of(function (methodsMap) {
        this._methods = R.merge(this._methods, methodsMap);
    }),

    getRoute: function () {
        var self = this;
        return function (req, res) {
            self._runMethod(req.context, req.body.method, req.body.params)
                .then(resultHandler(res))
                .catch(errorHandler(res));
        };
    }

};

module.exports = methods;
