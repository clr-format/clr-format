"use strict";

// Configuration
var config = {
    sourcesDir: "src",
    testsDir: "test",
    buildDir: "build",
    outputDir: "dist",
    allTS: "/**/*.ts",
    allDTS: "/**/*.d.ts",
    allJS: "/**/*.js",
    allFiles: "/*.*",
    all: "/*"
};

var paths = {
    sources: config.sourcesDir + config.allTS,
    tests: config.testsDir + config.allTS,
    dists: config.outputDir + config.allJS,
    core: config.sourcesDir + "/core",
    config: config.sourcesDir + "/configuration",
    tsConfig: "/tsconfig.json",
    references: config.sourcesDir + "/**/references.ts",
    npmExports: config.sourcesDir + "/exports.js",
    nugetExe: config.buildDir + "/nuget.exe"
};

// Modules
var gulp = require("gulp");
var fs = require('fs');
var del = require("del");
var tsc = require("gulp-typescript");
var empty = require("gulp-empty");
var nuget = require('gulp-nuget');
var tslint = require("gulp-tslint");
var uglify = require("gulp-uglify");
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var addsrc = require('gulp-add-src');
var request = require('request');
var replace = require('gulp-replace');
var jasmine = require("gulp-jasmine");
var typescript = require('typescript');

var tslintReporter = require("./build/reporters/tslint-msbuild.js")
var testReporter = require("./build/reporters/jasmine-nunit.js");

// Helpers
var tsProjects = {
    npm: tsc.createProject(config.sourcesDir + paths.tsConfig, { typescript: typescript }),
    core: tsc.createProject(paths.core + paths.tsConfig, { typescript: typescript }),
    config: tsc.createProject(paths.config + paths.tsConfig, { typescript: typescript }),
    tests: tsc.createProject(config.testsDir + paths.tsConfig, { typescript: typescript })
};

function negate(path) {
    return "!" + path;
}

function build(component) {

    var build = gulp.src([paths[component] + config.allTS, paths[component] + paths.reference])
        .pipe(tsc(tsProjects[component]));

    build.dts
        .pipe(replace(config.outputDir + "/", ""))
        .pipe(gulp.dest(config.outputDir));

    return build.js.pipe(gulp.dest(config.outputDir));
}

function test(minify) {
    return gulp.src(paths.tests)
        .pipe(tsc(tsProjects.tests)).js
        .pipe(minify ? uglify({ mangle: false, output: { beautify: true } }) : empty())
        .pipe(gulp.dest(config.buildDir))
        .pipe(jasmine({ reporter: new testReporter.NUnitXmlReporter({ savePath: config.buildDir }) }));
}

// Build Tasks
gulp.task("clean", function () {
    del.sync(config.outputDir + config.all);
});

gulp.task("clean-all", ["clean"], function () {
    del.sync(config.buildDir + config.allFiles);
});

gulp.task("lint", function () {
    return gulp.src([paths.sources, paths.tests, negate(config.allDTS)])
        .pipe(tslint())
        .pipe(tslint.report(tslintReporter.MSBuild));
});

gulp.task("build-core", ["lint"], function () {
    return build("core");
});

gulp.task("build-config", ["build-core"], function () {
    return build("config");
});

gulp.task("build-npm", ["lint"], function () {
    return gulp.src([config.sourcesDir + config.allTS, negate(paths.references)])
        .pipe(tsc(tsProjects.npm)).js
        .pipe(addsrc.append(paths.npmExports))
        .pipe(concat(tsProjects.npm.options.out))
        .pipe(gulp.dest(config.outputDir));
});

gulp.task("build", ["build-core", "build-config", "build-npm"]);

gulp.task("test", ["build"], function () {
    return test();
});

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

// Release tasks
gulp.task("nuget-download", function (done) {

    if (fs.existsSync(paths.nugetExe)) {
        return done();
    }

    return request.get("http://nuget.org/nuget.exe")
        .pipe(fs.createWriteStream(paths.nugetExe));
});

gulp.task("pack", ["nuget-download", "minify"], function () {
    gulp.src("")
        .pipe(nuget.pack({ nuspec: ".nuspec", nuget: paths.nugetExe, version: "0.1.2" }))
        .pipe(gulp.dest(config.buildDir));
    //.pipe(nuget.push({ feed: 'http://your-nuget-feed.org/', nuget: nugetPath, apiKey: 'secret-key-goes-here' }));
});
