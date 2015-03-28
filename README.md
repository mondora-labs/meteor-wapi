[![Build Status](https://travis-ci.org/mondora-labs/meteor-wapi.svg?branch=master)](https://travis-ci.org/mondora-labs/meteor-wapi)
[![Coverage Status](https://img.shields.io/coveralls/mondora-labs/meteor-wapi.svg)](https://coveralls.io/r/mondora-labs/meteor-wapi?branch=master)
[![Dependency Status](https://david-dm.org/mondora-labs/meteor-wapi.svg)](https://david-dm.org/mondora-labs/meteor-wapi)
[![devDependency Status](https://david-dm.org/mondora-labs/meteor-wapi/dev-status.svg)](https://david-dm.org/mondora-labs/meteor-wapi#info=devDependencies)

# meteor-wapi

Node module to allow CQRS-ing with Meteor.


## Example

```js
var bodyParser  = require("body-parser");
var express     = require("express");
var MongoClient = require("mongodb").MongoClient;
var MW          = require("meteor-wapi");

var mongoUrl = process.env.MONGO_URL || "mongodb://localhost:3001/meteor";

MongoClient.connect(mongoUrl, function (err, db) {
    if (err) {
        return cb(err);
    }
    var mw = new MW(db);
    var app = express()
        .use(bodyParser.json())
        .use(route, MW.bodyValidationMiddleware)
        .use(route, MW.contextMiddleware)
        .use(route, mw.getUserMiddleware())
        .post(route, mw.getRoute())
        .listen(process.env.PORT || 4000);
});
```
