var dirs = require("../config/dirs.js");
var branches = require("../config/branches.js");

var git = require("../utils/git.js");
var docs = require("./docs.js");
var version = require("./version.js");
var getVersion = require("../utils/getVersion.js");

module.exports = function (done) {

    var branch = git.getBranchName();

    validateState(branch);
    release(branch);
    done();
};

function validateState(branch) {
    if (branch !== branches.master) {
        throw new Error(`Releases can only be created from the '${branches.master}' branch, aborting release process`);
    }

    if (git.isDirty()) {
        throw new Error("Local changes detected, aborting release process");
    }
}

function release(branch) {
    try {
        git.checkout("--detach", "Could not detach from release branch");
        commitDist(branch);
    }
    catch (error) {
        rollbackState(branch, error);
        throw error;
    }
    finally {
        rollbackState(branch);
    }
}

function commitDist(branch) {
    try {
        git.add(
            "-f " + dirs.output,
            "Could not stage (forced) output files for release tag");

        var tagName = "v" + getVersion();
        git.commit(
            `-m "${tagName}"`,
            "Could not commit output files for release tag");

        createTag(branch, tagName);
    }
    catch (error) {
        git.reset("--hard");
        throw error;
    };
}

function createTag(branch, tagName) {
    try {
        git.tag(
            `-m "${tagName}" ${tagName}`,
            `Could not create the release tag ${tagName} (it might already exist)`);

        git.checkout(branch, "Could not checkout the origin release branch to initiate push");
        git.push("--tags", "Could not push release tag to remote");
        git.push("--recurse-submodules=on-demand", "Could not push submodules changes to remote");
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
        if (error && matchLastCommitMessage()) {

            git.reset("--hard HEAD~1");

            if (matchLastCommitMessage()) {
                git.reset("--hard HEAD~1");
            }

            throw error;
        }
    }
}

function matchLastCommitMessage() {

    var lastCommitMessage = git.getLastCommitMessage();
    if (lastCommitMessage === docs.getCommitMessage()) {
        git.submodule.reset(dirs.docs, "--hard HEAD~1");

        return true;
    }

    return lastCommitMessage === version.getCommitMessage(getVersion());
}
