var config = require("../config/main.js");
var paths = require("../config/paths.js");
var allNupkg = "*.nupkg";

var fs = require("fs");
var del = require("del");
var gulp = require("gulp");
var nuget = require("gulp-nuget");
var request = require("request");

module.exports.download = function (done) {

    if (fs.existsSync(paths.nugetExe)) {
        return done();
    }

    return request.get("http://nuget.org/nuget.exe")
        .pipe(fs.createWriteStream(paths.nugetExe));
};

module.exports.pack = function () {
    return gulp.src("")
        .pipe(nuget.pack({ nuspec: ".nuspec", nuget: paths.nugetExe, version: "0.1.2" }))
    //  .pipe(nuget.push({ feed: "http://your-nuget-feed.org/", nuget: nugetPath, apiKey: "secret-key-goes-here" }));
};

module.exports.dist = function () {

    gulp.src(allNupkg)
        .pipe(gulp.dest(config.outputDir));

    return del(allNupkg);
};
