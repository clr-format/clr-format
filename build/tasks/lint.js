var globs = require("../config/globs.js");
var paths = require("../config/paths.js");
var tslintReporter = require("../reporters/tslint-msbuild.js");

var gulp = require("gulp");
var tsc = require("gulp-typescript");
var tslint = require("gulp-tslint");
var negate = require("../utils/negate.js");

module.exports = function () {
    return gulp.src([paths.sources, paths.tests, negate(globs.allDTS)])
        .pipe(tslint())
        .pipe(tslint.report(tslintReporter.MSBuild));
};
