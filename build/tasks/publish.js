var paths = require("../config/paths.js");

var git = require("../utils/git.js");
var exec = require("../utils/exec.js");
var nuget = require("./nuget.js");

module.exports = function () {

    if (git.isDirty()) {
        throw new Error("Local changes detected, aborting publish process");
    }

    var branch = git.getBranchName();

    try {
        checkoutLatestReleaseTag();

        console.log("Publishing to NPM...")
        exec("npm publish");

        console.log("Publishing to NuGet...")
        return nuget.push(function () { rollbackState(branch); });
    }
    catch (error) {
        rollbackState(branch);
        throw error;
    }
};

function checkoutLatestReleaseTag() {
    var latestReleaseTag = git.getLatestReleaseTag();
    git.checkout(latestReleaseTag, "Could not checkout the latest annotated release tag");
}

function rollbackState(branch) {
    git.checkout(branch, "Could not restore the original working directory's state; carefully review its status");
}
