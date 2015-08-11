var exec = require("./exec.js");

module.exports = {

    add: function (args, errorMessage) {
        git("add", args, errorMessage);
    },

    checkout: function (args, errorMessage) {
        git("checkout", args, errorMessage);
    },

    commit: function (args, errorMessage) {
        git("commit", args, errorMessage);
    },

    push: function (args, errorMessage) {
        git("push", args, errorMessage);
    },

    reset: function (args, errorMessage) {
        git("reset", args, errorMessage);
    },

    tag: function (args, errorMessage) {
        git("tag", args, errorMessage);
    },

    isDirty: function () {
        return git("status", "--porcelain", "Could not check working directory's status") !== "";
    },

    getBranchName: function () {
        return git("rev-parse", "--abbrev-ref HEAD", "Could not resolve the current branch's name");
    },

    getLastCommitMessage: function () {
        return git("log -1 --pretty=%B", "Could not resolve the last commit's message");
    },

    getLatestReleaseTag: function () {
        var tagRev = git("rev-list", "--max-count=1 --tags", "Could not resolve latest release tag's revision");
        return git("describe", tagRev, "Could not get description for latest release tag's revision");
    }
};

function git(command, args, errorMessage) {
    command = ["git", command, args].join(" ").trim();
    return exec(command, errorMessage).trim();
}