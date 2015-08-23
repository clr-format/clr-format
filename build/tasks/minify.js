var dirs = require("../config/dirs.js");
var globs = require("../config/globs.js");
var paths = require("../config/paths.js");
var negate = require("../utils/negate.js")
var test = require("./test.js");

var gulp = require("gulp");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");

var beautifyOptions = {
    mangle: false,
    output: {
        beautify: true,
        bracketize: true,
        comments: function (node, comment) { return !(/\/ <reference path=/i.test(comment.value) || /tslint/i.test(comment.value)); }
    },
    compress: {
        booleans: false,
        evaluate: false,
        sequences: false,
        hoist_vars: true,
        comparisons: false,
        drop_console: true,
        conditionals: false,
        negate_iife: false
    }
};

var minifyOptions = {
    compress: {
        hoist_vars: true,
        drop_console: true
    }
}

module.exports = function () {

    var sources = [paths.dists, negate(dirs.output + globs.allMinJS)];

    gulp.src(sources)
        .pipe(uglify(beautifyOptions))
        .pipe(gulp.dest(dirs.output));

    sources.push(negate(dirs.output + globs.allNPM));

    gulp.src(sources)
        .pipe(uglify(minifyOptions))
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest(dirs.output));

    return test.jasmine(beautifyOptions);
};
