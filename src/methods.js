var BPromise   = require("bluebird");
var bodyParser = require("body-parser");
var express    = require("express");
var R          = require("ramda");
var t          = require("tcomb");

var BPromiseType  = require("./lib/bpromise-type.js");
var errorHandler  = require("./lib/error-handler.js");
var MWError       = require("./lib/mw-error.js");
var resultHandler = require("./lib/result-handler.js");
var middleware    = require("./middleware.js");

/*
*   By convention, a method can either:
*   - throw
*   - return a value
*   - return a thenable
*/

var _runMethod = function (reqContext, name, args) {
    return BPromise.resolve()
        .bind(this)
        .then(function () {
            var method = this._methods[name];
            if (!method) {
                throw new MWError(404, "Method not found");
            }
            var context = R.merge(method.context, reqContext);
            return method.fn.apply(context, args);
        });
};

var methods = function (methodsMap, context) {
    var transform = function (fn) {
        return {
            fn: fn,
            context: context || {}
        };
    };
    this._methods = R.pipe(
        R.mapObj(transform),
        R.merge(this._methods)
    )(methodsMap);
};

var getRoute = function () {
    var self = this;
    return express.Router()
        .use(bodyParser.json())
        .use(middleware.bodyValidation())
        .use(middleware.context())
        .use(middleware.user(self))
        .post("*", function (req, res) {
            self._runMethod(req.context, req.body.method, req.body.params)
                .then(resultHandler(res))
                .catch(errorHandler(res));
        });
};

/*
*   Dynamically type-check our API
*/
module.exports = {
    _runMethod: t.func([t.Obj, t.Str, t.Arr], BPromiseType).of(_runMethod),
    methods: function (methodsMap, context) {
        /*
        *   Workaround tcomb issue #84 (which won't probably be fixed).
        *   tcomb curries functions wrapped with the `Func.of` method.
        *   Therefore, being the `context` argument optional, to avoid forcing
        *   our user to always specify it as `undefined` we do it for them
        *   (simply by calling the function with the two parameters, which
        *   guarantees us that, inside the tcomb wrapper function,
        *   `arguments.length` equals 2).
        */
        return t.func([t.dict(t.Str, t.Func), t.maybe(t.Obj)], t.Nil)
            .of(methods)
            .call(this, methodsMap, context);
    },
    getRoute: t.func([], t.Func).of(getRoute)
};
