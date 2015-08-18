var dirs = require("../config/dirs.js");
var paths = require("../config/paths.js");
var branches = require("../config/branches.js");

var git = require("../utils/git.js");
var negate = require("../utils/negate.js");
var getVersion = require("../utils/getVersion.js");

var gulp = require("gulp");
var format = require("clr-format");
var typedoc = require("gulp-typedoc");

module.exports = function (done) {

    validateState();
    resetSubmoduleState();

    return gulp.src([paths.sources, negate(paths.references)])
        .pipe(typedoc({ out: dirs.docs, mode: "file", name: "CLR Format" }))
        .on("end", getOnEndCallback());
};

function validateState() {
    if (git.getBranchName() !== branches.master) {
        throw new Error(format("Documentation can only be generated from the '{0}' branch, aborting documentation process", branches.master));
    }

    if (git.isDirty()) {
        throw new Error("Local changes detected, aborting documentation process");
    }
}

function resetSubmoduleState() {
    git.submodule.reset(dirs.docs, format("Could not reset '{0}' submodule", dirs.docs));
    git.submodule.checkout(
        dirs.docs,
        branches.ghPages,
        format("Could not checkout '{0}' submodule to '{1}' branch", dirs.docs, branches.ghPages));
}

function getOnEndCallback() {

    var submodule = gulp.src(dirs.docs + "/.git");

    return function () {
        submodule
            .pipe(gulp.dest(dirs.docs))
            .on("end", commitDocs);;
    };
}

function commitDocs() {
    try {
        git.submodule.add(dirs.docs, "--all", format("Could not stage output files to '{0}' submodule", branches.ghPages));

        if (git.submodule.isClean(dirs.docs)) {
            return console.log("Output documentation files resulted in no changes");
        }

        var commitArgs = format("--all -m \"updating documentation for v{0}\"", getVersion());
        git.submodule.commit(dirs.docs, commitArgs, format("Could not commit output files to '{0}' submodule", dirs.docs));
        git.commit(commitArgs, format("Could not commit the latest ref of '{0}' submodule in superproject", dirs.docs));

        git.push("origin --atomic --recurse-submodules=on-demand");
    }
    catch (error) {
        resetSubmoduleState();
        throw error;
    }
}
