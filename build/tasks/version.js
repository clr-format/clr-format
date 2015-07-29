var git = require("../utils/git.js");

var format = require("clr-format");
var mversion = require("mversion");

module.exports = function (versionType) {
    return function (done) {

        if (git.isDirty()) {
            throw new Error("Local changes detected, aborting version bump");
        }

        mversion.update({ version: versionType }, function (error, data) {

            if (error) {
                throw error;
            }

            git.commit(
                format("-a -m \"{0}\"", module.exports.getCommitMessage(data.newVersion)),
                "Could not commit bumped component files' version");

            done();
        });
    };
};

module.exports.getCommitMessage = function (version) {
    return "preparing version " + version;
};
