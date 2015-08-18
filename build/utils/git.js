var exec = require("./exec.js");
var regex = require("../config/regex.js");
var shell = require('shelljs');

var root = module.exports = {

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
    },

    submodule: {

        add: function (submodule, args, errorMessage) {
            gitSubmoduleDir(submodule, function () {
                root.add(args, errorMessage);
            });
        },

        checkout: function (submodule, args, errorMessage) {
            gitSubmoduleDir(submodule, function () {
                root.checkout(args, errorMessage)
            });
        },

        commit: function (submodule, args, errorMessage) {
            gitSubmoduleDir(submodule, function () {
                root.commit(args, errorMessage);
            });
        },

        reset: function (submodule, errorMessage) {
            gitSubmodule("deinit", "--force " + submodule, errorMessage);
            gitSubmodule("update", "--init --remote " + submodule, errorMessage);
        },

        isClean: function (submodule) {
            return gitSubmoduleDir(submodule, function () {
                return !root.isDirty();
            });
        }
    }
};

function git(command, args, errorMessage) {
    return exec(getCommand("git", command, args), errorMessage).trim();
}

function gitSubmodule(command, args, errorMessage) {
    return exec(getCommand("git submodule", command, args), errorMessage).trim();
}

function gitSubmoduleDir(dir, innerCommand) {

    if (!regex.validFilename.test(dir)) {
        throw Error("Argument 'dir' must be a valid filename string");
    }

    try {
        shell.cd(dir);
        return innerCommand();
    }
    finally {
        shell.cd("..");
    }
}

function getCommand(main, command, args) {
    return [main, command, args].join(" ").trim();
}
