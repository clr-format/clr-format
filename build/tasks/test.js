var dirs = require("../config/dirs.js");
var paths = require("../config/paths.js");
var tsProjects = require("../config/tsProjects.js");
var testReporter = require("../reporters/jasmine-nunit.js");

var gulp = require("gulp");
var tsc = require("gulp-typescript");
var wrap = require("gulp-wrap");
var uglify = require("gulp-uglify");
var jasmine = require("gulp-jasmine");

module.exports.jasmine = function (minifyOpts) {

    var build = gulp.src(paths.tests)
        .pipe(tsc(tsProjects.testsJasmine)).js;

    if (typeof minifyOpts !== "function") {
        build = build.pipe(wrap({ src: paths.coreTemplate }))
            .pipe(uglify(minifyOpts));
    }

    return build.pipe(gulp.dest(dirs.build))
        .pipe(jasmine({ reporter: new testReporter.NUnitXmlReporter({ savePath: dirs.build }) }));
};

module.exports.npm = function () {
    var testExports = require("../../test/exports_should.js");
    testExports();
};
