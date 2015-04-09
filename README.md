[![Build Status](https://travis-ci.org/mondora-labs/meteor-wapi.svg?branch=master)](https://travis-ci.org/mondora-labs/meteor-wapi)
[![Coverage Status](https://img.shields.io/coveralls/mondora-labs/meteor-wapi.svg)](https://coveralls.io/r/mondora-labs/meteor-wapi?branch=master)
[![Dependency Status](https://david-dm.org/mondora-labs/meteor-wapi.svg)](https://david-dm.org/mondora-labs/meteor-wapi)
[![devDependency Status](https://david-dm.org/mondora-labs/meteor-wapi/dev-status.svg)](https://david-dm.org/mondora-labs/meteor-wapi#info=devDependencies)

# meteor-wapi

Node module to allow CQRS-ing with Meteor.

## Install

`npm i --save meteor-wapi`

## Example

```js
var express     = require("express");
var MongoClient = require("mongodb").MongoClient;
var MW          = require("meteor-wapi");

var mongoUrl = process.env.MONGO_URL || "mongodb://localhost:3001/meteor";

MongoClient.connect(mongoUrl, function (err, db) {
    var mw = new MW(db);
    var optionalContext = {
        prefix: "echo: "
    };
    mw.methods({
        echo: function (string) {
            return this.prefix + string;
        }
    }, optionalContext);
    var app = express()
        .use("/call", mw.getRouter())
        .listen(process.env.PORT || 4000);
});
```

## API

### new MW(db)

Creates a new MW instance.

##### Arguments

* `db` **MongoClient connection** _required_: a mongodb connection, as returned
  (via callback) by the `MongoClient.connect` method.

##### Returns

An MW instance.

### .methods(methodsMap, optionalContext)

Registers one or more remote methods (mimicking Meteor's API). The methods will
be invoked when the client `POST`s a DDP `method` message to the server.

Methods can either:
* throw an error
* return a value
* return a promise

If the method returns a value (or an eventually fulfilled promise), the client
will receive the returned (or resolved) value in the DDP response message.

If the method throws (or returns an eventually rejected promise), the client
will receive the error in the DDP response message. If the error is an instance
of `MW.Error`, its code and message will be used for the reply. Otherwise a
generic `500 INTERNAL SERVER ERROR` error will be used.

##### Arguments

* `methodsMap` **string-function dictionary** _required_: a dictionary of
  functions (just like in Meteor).

* `optionalContext` **object** _optional_: an optional object which will be
  mixed in with the execution context of the method (the `this` value).

##### Returns

Nothing.

### .getRouter()

Returns an `express` router which listens for `POST`ed DDP `method` messages,
authenticates them and runs the appropriate methods.

##### Arguments

None.

##### Returns

An `express` router (to be used as argument to an express app `use` method).

## Test

After cloning the repository and installing dependecies with `npm install`:

* to run unit tests: `npm run unit-tests`
* to run integration tests: `npm run integration-tests` (you need a running
  local mongo listening on port 27017)
