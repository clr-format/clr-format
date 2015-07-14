var config = require("../config/main.js");
var paths = require("../config/paths.js");
var negate = require("../utils/negate.js");
var tsProjects = require("../config/tsProjects.js");

var gulp = require("gulp");
var tsc = require("gulp-typescript");
var addsrc = require("gulp-add-src");
var concat = require("gulp-concat");
var replace = require("gulp-replace");

module.exports.js = function (component) {

    return function () {

        var build = gulp.src([paths[component] + config.allTS, paths[component] + paths.reference])
            .pipe(tsc(tsProjects[component]));

        build.dts
            .pipe(replace(config.outputDir + "/", ""))
            .pipe(gulp.dest(config.outputDir));

        return build.js.pipe(gulp.dest(config.outputDir));
    };
};

module.exports.npm = function (component) {
    return gulp.src([config.sourcesDir + config.allTS, negate(paths.references)])
        .pipe(tsc(tsProjects.npm)).js
        .pipe(addsrc.append(paths.npmExports))
        .pipe(concat(tsProjects.npm.options.out))
        .pipe(gulp.dest(config.outputDir));
};
