var dirs = require("../config/dirs.js");
var paths = require("../config/paths.js");
var files = require("../config/files.js");
var tsProjects = require("../config/tsProjects.js");
var testReporter = require("../reporters/jasmine-nunit.js");
var testExports = require("../../test/exports_should.js")

var gulp = require("gulp");
var tsc = require("gulp-typescript");
var wrap = require("gulp-wrap");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var jasmine = require("gulp-jasmine");

module.exports.jasmine = function (minifyOpts) {

    var build = gulp.src(paths.tests)
        .pipe(tsc(tsProjects.tests)).js;

    if (typeof minifyOpts !== "function") {
        build = build.pipe(wrap({ src: paths.coreTemplate }))
            .pipe(uglify(minifyOpts));
    }

    return build.pipe(gulp.dest(dirs.build))
        .pipe(jasmine({ reporter: new testReporter.NUnitXmlReporter({ savePath: dirs.build }) }));
};

module.exports.npm = function () {
    testExports();
};

module.exports.browser = function (minifyOpts) {

    var build = gulp.src(paths.tests)
        .pipe(tsc({ noImplicitAny: true })).js
        .pipe(concat(files.testsBrowser))
        .pipe(wrap({ src: paths.iifeTemplate }));

    if (typeof minifyOpts !== "function") {
        build = build.pipe(uglify(minifyOpts));
    }

    return build.pipe(gulp.dest(dirs.build));
};
