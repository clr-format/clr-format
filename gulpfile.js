"use strict";

var config = {
    sourcesDir: "src",
    testsDir: "test",
    outputDir: "dist",
    allTS: "/**/*.ts",
    allDTS: "/**/*.d.ts",
    allJS: "/**/*.js"
};

var paths = {
    sources: config.sourcesDir + config.allTS,
    tests: config.testsDir + config.allTS,
    dists: config.outputDir + config.allJS,
    tsConfig: "/tsconfig.json",
    npmExport: config.sourcesDir + "/core/Export.js"
};

var gulp = require("gulp");
var del = require("del");
var tsc = require("gulp-typescript");
var empty = require("gulp-empty");
var tslint = require("gulp-tslint");
var uglify = require("gulp-uglify");
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var addsrc = require('gulp-add-src');
var jasmine = require("gulp-jasmine");

var tslintReporter = require("./build/reporters/tslint-msbuild.js")
var testReporter = require("./build/reporters/jasmine-nunit.js");

var sourceProject = tsc.createProject(config.sourcesDir + paths.tsConfig, {
    typescript: require('typescript')
});
var testsProject = tsc.createProject(config.testsDir + paths.tsConfig, {
    typescript: require('typescript')
});

gulp.task("clean", function () {
    del.sync(["dist"]);
});

gulp.task("lint", function () {
    return gulp.src([paths.sources, paths.tests, "!" + config.allDTS])
        .pipe(tslint())
        .pipe(tslint.report(tslintReporter.MSBuild));
});

gulp.task("build", ["lint"], function (cb) {

    var build = gulp.src(paths.sources)
        .pipe(tsc(sourceProject));

    build.dts.pipe(gulp.dest(config.outputDir));
    build.js.pipe(gulp.dest(config.outputDir));
    return build.js
        .pipe(addsrc.append(paths.npmExport))
        .pipe(concat(sourceProject.options.out))
        .pipe(rename({ suffix: "-npm" }))
        .pipe(gulp.dest(config.outputDir));
});

function test(minify) {
    return gulp.src(paths.tests)
        .pipe(tsc(testsProject)).js
        .pipe(minify ? uglify({ mangle: false, output: { beautify: true } }) : empty())
        .pipe(gulp.dest(config.outputDir))
        .pipe(jasmine({ reporter: new testReporter.NUnitXmlReporter({ savePath: config.outputDir }) }));
}

gulp.task("test", ["build"], function () { return test(); });

gulp.task("minify", ["clean", "build"], function () {

    gulp.src(paths.dists)
        .pipe(uglify({ mangle: false, output: { beautify: true } }))
        .pipe(gulp.dest(config.outputDir));

    gulp.src(paths.dists)
        .pipe(uglify())
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest(config.outputDir));

    return test(true);
});

gulp.task("watch", function () {
    gulp.watch([paths.sources, paths.tests], ["test"]);
});

gulp.task("default", ["clean", "watch", "test"]);
