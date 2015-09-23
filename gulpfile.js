"use strict";

// Root
var buildDir = "./build";
var configsPath = buildDir + "/config/";
var tasksPath = buildDir + "/tasks/";
var requireConfig = function (moduleName) { return require(configsPath + moduleName + ".js"); };
var requireTask = function (moduleName) { return require(tasksPath + moduleName + ".js"); };

// Configuration
var paths = requireConfig("paths");

// Modules
var gulp = require("gulp");
var del = requireTask("del");
var lint = requireTask("lint");
var test = requireTask("test");
var docs = requireTask("docs");
var build = requireTask("build");
var nuget = requireTask("nuget");
var minify = requireTask("minify");
var version = requireTask("version");
var release = requireTask("release");
var publish = requireTask("publish");

// Build Tasks
gulp.task("default", ["clean", "build", "test", "watch"]);

gulp.task("clean", del.output);
gulp.task("clean-all", ["clean"], del.build);

gulp.task("lint", lint());
gulp.task("lint-test", lint("test"));
gulp.task("lint-core", lint("core"));
gulp.task("lint-intl", lint("intl"));
gulp.task("lint-config", lint("config"));
gulp.task("lint-sources", ["lint-core", "lint-intl", "lint-config"]);

gulp.task("build", ["build-core", "build-intl", "build-config", "build-npm"]);
gulp.task("build-npm", ["lint-core", "lint-config"], build.npm);
gulp.task("build-test", ["lint-test"], build.test);
gulp.task("build-docs", ["lint-sources"], docs.build);
gulp.task("build-core", ["lint-core"], build.js("core"));
gulp.task("build-intl", ["lint-intl", "build-core"], build.js("intl"));
gulp.task("build-config", ["lint-config", "build-core"], build.js("config"));

gulp.task("test", ["test-npm", "test-jasmine", "test-browser"]);
gulp.task("test-npm", ["build-npm"], test.npm);
gulp.task("test-jasmine", ["lint-test"], test.jasmine);
gulp.task("test-browser", ["build-core", "build-config", "build-test"]);

gulp.task("watch", function () {
    gulp.watch([paths.sources], ["build", "test-npm"]);
    gulp.watch([paths.sources, paths.tests], ["test-jasmine", "build-test"]);
});

gulp.task("watch-release", function () {
    gulp.watch([paths.sources], ["build-release"]);
    gulp.watch([paths.sources, paths.tests], ["minify-tests"]);
});

// Release tasks
gulp.task("minify", ["minify-tests", "minify-sources"]);
gulp.task("minify-tests", ["minify-jasmine", "minify-browser"]);
gulp.task("minify-sources", minify);
gulp.task("minify-jasmine", ["lint-test"], minify.jasmine);
gulp.task("minify-browser", ["lint-test"], minify.browser);

gulp.task("build-release", ["clean", "build", "test-npm", "minify-tests"], minify);

gulp.task("nuget-download", nuget.download);
gulp.task("nuget-pack", ["nuget-download", "build-release"], nuget.pack);

gulp.task("bump-major", version("major"));
gulp.task("bump-minor", version("minor"));
gulp.task("bump-patch", version("patch"));

gulp.task("release-major", ["bump-major", "release-pack"], release);
gulp.task("release-minor", ["bump-minor", "release-pack"], release);
gulp.task("release-patch", ["bump-patch", "release-pack"], release);
gulp.task("release-pack", ["nuget-pack", "release-docs"]);
gulp.task("release-docs", docs.release);

gulp.task("publish", ["nuget-download"], publish);
