"use strict";

var npmShrinkwrap = require('npm-shrinkwrap');
var args = require('yargs').argv;
var fs = require('fs');
var cwd = process.cwd();
var npm = require('npm');
var registry;

npm.load(function (err) {
    if (err) { throw err; }
    registry = npm.config.get('registry');
    performShrinkwrap();
});

function stripResolvedAndFrom(json) {

    if (!json) {
        return json;
    }
    var key;

    if (json.resolved && json.resolved.indexOf(registry) > -1) {
        delete json.resolved;
    }
    if (json.from) {
        delete json.from;
    }
    if (json.dependencies) {
        for (key in json.dependencies) {
            if (json.dependencies.hasOwnProperty(key)) {
                stripResolvedAndFrom(json.dependencies[key]);
            }
        }
    }

    return json;
}

function onShrinkwrapComplete (err, optionalWarnings) {
    if (err) {
        throw err;
    }

    optionalWarnings.forEach(function (err) {
        console.warn(err.message)
    });

    if (args.verbose) {
        console.log("wrote initial npm-shrinkwrap.json");
    }

    var pathToJson = cwd + '/npm-shrinkwrap.json';
    var json = require(pathToJson);

    json = stripResolvedAndFrom(json);

    fs.writeFile(pathToJson, JSON.stringify(json, null, 4), function (err) {
        if (err) {
            throw err;
        }
        console.log("wrote simplified npm-shrinkwrap.json");
    });
}

function performShrinkwrap () {
    npmShrinkwrap({
        dirname: cwd,
        dev: !args.production || true,
        production: args.production,
        warnOnNotSemver: args.failOnNotSemver || true
    }, onShrinkwrapComplete);
}