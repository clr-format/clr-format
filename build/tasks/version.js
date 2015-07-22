var mversion = require("mversion"),
    exec = require("../utils/exec.js");

module.exports = function (version) {
    return function (done) {

        if (exec("git status --porcelain")) {
            throw new Error("Local changes detected, aborting version bump");
        }

        mversion.update({ version: version, commitMessage: "Bumped to version %s" });
        done();
    };
};
