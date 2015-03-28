var t = require("tcomb");

module.exports = t.struct({
    method: t.Str,
    params: t.Arr,
    loginToken: t.maybe(t.Str)
});
