var dirs = require("../config/dirs.js");
var paths = require("../config/paths.js");
var tsProjects = require("../config/tsProjects.js");
var testReporter = require("../reporters/jasmine-nunit.js");
var testExports = require("../../test/exports_should.js")

var gulp = require("gulp");
var tsc = require("gulp-typescript");
var empty = require("gulp-empty");
var uglify = require("gulp-uglify");
var jasmine = require("gulp-jasmine");

module.exports.jasmine = function (minify) {
    return gulp.src(paths.tests)
        .pipe(tsc(tsProjects.tests)).js
        .pipe(minify ? uglify({ mangle: false, output: { beautify: true } }) : empty())
        .pipe(gulp.dest(dirs.build))
        .pipe(jasmine({ reporter: new testReporter.NUnitXmlReporter({ savePath: dirs.build }) }));
};

module.exports.npm = function () {
    testExports();
};
