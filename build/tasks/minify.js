var dirs = require("../config/dirs.js");
var globs = require("../config/globs.js");
var paths = require("../config/paths.js");
var negate = require("../utils/negate.js")
var test = require("./test.js");

var gulp = require("gulp");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");

module.exports = function () {

    gulp.src(paths.dists)
        .pipe(uglify({ mangle: false, output: { beautify: true } }))
        .pipe(gulp.dest(dirs.output));

    gulp.src([paths.dists, negate(dirs.output + globs.allNPM)])
        .pipe(uglify())
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest(dirs.output));

    return test.jasmine(true);
};
