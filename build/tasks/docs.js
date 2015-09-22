var dirs = require("../config/dirs.js");
var paths = require("../config/paths.js");
var branches = require("../config/branches.js");

var git = require("../utils/git.js");
var negate = require("../utils/negate.js");
var getVersion = require("../utils/getVersion.js");

var gulp = require("gulp");
var format = require("clr-format");
var typedoc = require("gulp-typedoc");
var replace = require("gulp-replace");

module.exports.build = function () {
    reinitSubmodule();
    return generateDocs();
};

module.exports.release = function () {
    validateState();
    reinitSubmodule();

    return generateDocs(true);
};

module.exports.getCommitMessage = function () {
    return "updating documentation for " + getVersion();
};

function generateDocs(publish) {
    return gulp.src([paths.sources, negate(paths.references)])
        .pipe(typedoc({ out: dirs.docs, mode: "file", name: "CLR Format" }))
        .on("end", restoreSubmoduleFile(publish));
}

function restoreSubmoduleFile(publish) {

    var submodule = gulp.src(dirs.docs + "/.git");

    return function () {
        return submodule.pipe(gulp.dest(dirs.docs))
            .on("end", replaceSourceLinks(publish));
    }
}

function replaceSourceLinks(publish) {
    return function () {
        return gulp.src(paths.docs)
            .pipe(replace(/blob\/[^\/]+/g, "blob/v" + getVersion()))
            .pipe(gulp.dest(dirs.docs))
            .on("end", publish ? commitDocs : stageDocs);
    }
}

function validateState() {
    if (git.getBranchName() !== branches.master) {
        throw new Error(format("Documentation can only be generated from the '{0}' branch, aborting documentation process", branches.master));
    }

    if (git.isDirty()) {
        throw new Error("Local changes detected, aborting documentation process");
    }
}

function reinitSubmodule() {
    git.submodule.reinit(dirs.docs, format("Could not reinit '{0}' submodule", dirs.docs));
    git.submodule.checkout(
        dirs.docs,
        branches.ghPages,
        format("Could not checkout '{0}' submodule to '{1}' branch", dirs.docs, branches.ghPages));
}

function commitDocs() {

    var resetSubmodule;

    try {
        stageDocs();

        if (git.submodule.isClean(dirs.docs)) {
            return console.log("Output documentation files resulted in no changes");
        }

        var commitArgs = format("--all -m \"{0}\"", module.exports.getCommitMessage());

        git.submodule.commit(dirs.docs, commitArgs, format("Could not commit output files to '{0}' submodule", dirs.docs));
        resetSubmodule = true;

        git.commit(commitArgs, format("Could not commit the latest ref of '{0}' submodule in superproject", dirs.docs));
    }
    catch (error) {
        if (resetSubmodule) {
            git.submodule.reset(dirs.docs, "--hard HEAD~1");
        }

        throw error;
    }
}

function stageDocs() {
    git.submodule.add(dirs.docs, "--all", format("Could not stage output files to '{0}' submodule", branches.ghPages));
}
