var dirs = require("../config/dirs.js");
var git = require("../utils/git.js");

var format = require("clr-format");
var version = require("./version.js");
var getVersion = require("../utils/getVersion.js");

module.exports = function (done) {

    var branch = git.getBranchName();

    validateState(branch);
    release(branch);
    done();
};

function validateState(branch) {
    if (branch !== "master") {
        throw new Error("Releases can only be created from the master branch, aborting release process");
    }

    if (git.isDirty()) {
        throw new Error("Local changes detected, aborting release process");
    }
}

function release(branch) {
    try {
        git.checkout("--detach", "Could not detach from release branch");
        commitDist();
    }
    catch (error) {
        rollbackState(branch, error);
        throw error;
    }
    finally {
        rollbackState(branch);
    }
}

function commitDist() {
    try {
        git.add(
            "-f " + dirs.output,
            "Could not stage (forced) output files for release tag");

        var tagName = "v" + getVersion();
        git.commit(
            format("-m \"{0}\"", tagName),
            "Could not commit output files for release tag");

        createTag(tagName);
    }
    catch (error) {
        git.reset("--hard");
        throw error;
    };
}

function createTag(tagName) {
    try {
        git.tag(
            format("-m \"{0}\" {0}", tagName),
            format("Could not create the release tag {0} (it might already exist)", tagName));

        git.push(
            "origin --follow-tags --atomic",
            "Could not push changes to remote (network connection or stored credentials might be missing)");
    }
    catch (error) {
        rollbackRemote(tagName);
        throw error;
    }
}

function rollbackRemote(tagName) {
    try {
        git.tag("-d " + tagName);
    }
    finally {
        git.push("origin :refs/tags/" + tagName);
    }
}

function rollbackState(branch, error) {
    try {
        git.checkout(branch, "Could not restore the original working directory's state; carefully review its and the remote's status");
    }
    finally {
        if (error && git.getLastCommitMessage() === version.getCommitMessage(getVersion())) {
            git.reset("--hard HEAD~1");
            throw error;
        }
    }
}
