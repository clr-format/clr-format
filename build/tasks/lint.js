var globs = require("../config/globs.js");
var paths = require("../config/paths.js");
var tslintReporter = require("../reporters/tslint-msbuild.js");

var gulp = require("gulp");
var tsc = require("gulp-typescript");
var tslint = require("gulp-tslint");
var negate = require("../utils/negate.js");

module.exports = function (component) {
    return function () {

        var sources = [paths[component] ? paths[component] + globs.allDTS : paths.sources, negate(globs.allDTS)];
        if (!component) {
            sources.push(paths.tests);
        }

        return gulp.src(sources)
            .pipe(tslint())
            .pipe(tslint.report(tslintReporter.MSBuild));
    };
};
