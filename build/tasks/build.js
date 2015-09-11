var dirs = require("../config/dirs.js");
var globs = require("../config/globs.js");
var paths = require("../config/paths.js");
var negate = require("../utils/negate.js");
var tsProjects = require("../config/tsProjects.js");

var gulp = require("gulp");
var tsc = require("gulp-typescript");
var wrap = require("gulp-wrap");
var empty = require("gulp-empty");
var addsrc = require("gulp-add-src");
var concat = require("gulp-concat");
var replace = require("gulp-replace");

module.exports.js = function (component) {

    return function () {

        var build = gulp.src([paths[component] + globs.allTS, paths[component] + paths.reference])
            .pipe(tsc(tsProjects[component]));

        build.dts
            .pipe(replace(dirs.output + "/", ""))
            .pipe(gulp.dest(dirs.output));

        return build.js
            .pipe(wrap({ src: component === "core" ? paths.coreTemplate : paths.iifeTemplate }))
            .pipe(gulp.dest(dirs.output));
    };
};

module.exports.npm = function (component) {

    var sources = [
        paths.core + globs.allTS,
        paths.config + globs.allTS,
        paths.intl + globs.allTS,
        negate(paths.references)
    ];

    return gulp.src(sources)
        .pipe(tsc(tsProjects.npm)).js
        .pipe(addsrc.append(paths.npmExports))
        .pipe(concat(tsProjects.npm.options.out))
        .pipe(gulp.dest(dirs.output));
};
