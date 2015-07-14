var config = require("../config/main.js");
var paths = require("../config/paths.js");
var test = require("./test.js");

var gulp = require("gulp");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");

module.exports = function () {

    gulp.src(paths.dists)
        .pipe(uglify({ mangle: false, output: { beautify: true } }))
        .pipe(gulp.dest(config.outputDir));

    gulp.src(paths.dists)
        .pipe(uglify())
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest(config.outputDir));

    return test(true);
};
