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
var build = requireTask("build");
var nuget = requireTask("nuget");
var minify = requireTask("minify");
var version = requireTask("version");
var release = requireTask("release");
var publish = requireTask("publish");

// Build Tasks
gulp.task("clean", del.output);
gulp.task("clean-all", ["clean"], del.build);

gulp.task("lint", lint());
gulp.task("lint-core", lint("core"));
gulp.task("lint-config", lint("config"));
gulp.task("lint-test", lint("test"));

gulp.task("build-core", ["lint-core"], build.js("core"));
gulp.task("build-config", ["build-core", "lint-config"], build.js("config"));
gulp.task("build-npm", ["lint-core", "lint-config"], build.npm);
gulp.task("build", ["build-core", "build-config", "build-npm", "test-npm"]);

gulp.task("test", ["lint-test"], test.jasmine);
gulp.task("test-npm", ["build-npm"], test.npm);
gulp.task("minify", ["clean", "build"], minify);

gulp.task("watch", function () {
    gulp.watch([paths.sources], ["build"]);
    gulp.watch([paths.sources, paths.tests], ["test"]);
});

gulp.task("default", ["clean", "watch", "build", "test"]);

// Release tasks
gulp.task("nuget-download", nuget.download);
gulp.task("nuget-pack", ["nuget-download", "minify"], nuget.pack);

gulp.task("bump-major", version("major"));
gulp.task("bump-minor", version("minor"));
gulp.task("bump-patch", version("patch"));

gulp.task("release-major", ["bump-major", "nuget-pack"], release);
gulp.task("release-minor", ["bump-minor", "nuget-pack"], release);
gulp.task("release-patch", ["bump-patch", "nuget-pack"], release);

gulp.task("publish", ["nuget-download"], publish);
