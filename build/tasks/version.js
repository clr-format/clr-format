var exec = require("../utils/exec.js");
var isGitClean = require("../utils/isGitClean.js");

var format = require("clr-format");
var mversion = require("mversion");

module.exports = function (version) {
    return function (done) {

        if (!isGitClean()) {
            throw new Error("Local changes detected, aborting version bump");
        }

        mversion.update({ version: version }, function (error, data) {

            if (error) {
                throw error;
            }

            exec(format("git commit -a -m \"preparing version {0}\"", data.newVersion));
            done();
        });
    };
};
