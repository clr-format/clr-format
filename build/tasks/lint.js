var globs = require("../config/globs.js");
var paths = require("../config/paths.js");
var tslintReporter = require("../reporters/tslint-msbuild.js");

var gulp = require("gulp");
var tsc = require("gulp-typescript");
var tslint = require("gulp-tslint");
var negate = require("../utils/negate.js");

module.exports = function (component) {
    return function () {
        return gulp.src(getSources(component))
            .pipe(tslint())
            .pipe(tslint.report(tslintReporter.MSBuild));
    };
};

function getSources(component) {

    var sources = [negate(globs.allDTS)];

    if (paths[component]) {
        sources.push(paths[component] + globs.allTS);
    }
    else if (component === "test") {
        sources.push(paths.tests);
    }
    else {
        sources.push(paths.sources, paths.tests);
    }

    return sources;
}
