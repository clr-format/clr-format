var dirs = require("../config/dirs.js");
var exec = require("../utils/exec.js");
var isGitClean = require("../utils/isGitClean.js");

var format = require("clr-format");
var getVersion = require("../utils/getVersion.js");

module.exports = function (done) {

    if (!isGitClean()) {
        throw new Error("Local changes detected, aborting release process");
    }

    release();
    done();
};

function release() {

    var branch = exec("git rev-parse --abbrev-ref HEAD").trim();

    try {
        exec("git checkout --detach");
        addDist();
    }
    finally {
        exec("git checkout " + branch);
    }

    exec("git push");
}

function addDist(next) {
    try {
        exec("git add -f " + dirs.output);

        var version = getVersion();
        exec(format("git commit -m \"v{0}\"", version));

        tag(version);
    }
    catch (error) {
        exec("git reset --hard");
        throw error;
    };
}

function tag(version) {
    try {
        exec(format("git tag v{0} -m \"v{0}\"", version));
        exec(format("git push origin v{0}", version));
    }
    catch (error) {
        exec(format("git tag -d v{0}", version));
        exec(format("git push origin :refs/tags/v{0}", version));
        throw error;
    }
}
