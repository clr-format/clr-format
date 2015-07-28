var files = require("../config/files.js");
var exec = require("../utils/exec.js");

var format = require("clr-format");
var mversion = require("mversion");

module.exports = function (version) {
    return function (done) {

        if (exec("git status --porcelain")) {
            throw new Error("Local changes detected, aborting version bump");
        }

        mversion.update({ version: version }, function (err, data) {

            if (err) {
                throw err;
            }

            exec(format("git commit -a -m \"preparing version {0}\"", data.newVersion));
            done();
        });
    };
};
